// import { useState, useEffect, useCallback } from "react";

// type Theme = "light" | "dark";

// const DEFAULT_THEME: Theme = "dark";

// const themeScript = `
//   (function() {
//     // Always set the theme to dark by default
//     const theme = 'dark';
//     const root = document.documentElement;
    
//     // Apply the theme immediately to prevent flash
//     root.style.setProperty('--initial-color-mode', theme);
//     root.classList.add('dark');
    
//     // Save to localStorage for persistence
//     localStorage.setItem('theme', theme);
//   })()
// `;

// export const useTheme = () => {
//   const [theme, setTheme] = useState<Theme>(() => {
//     if (typeof window === "undefined") {
//       return DEFAULT_THEME;
//     }

//     // First check localStorage
//     const saved = localStorage.getItem("theme") as Theme;
//     if (saved && (saved === "light" || saved === "dark")) {
//       return saved;
//     }

//     // Then check system preference
//     const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
//     return prefersDark ? "dark" : "light";
//   });

//   const updateTheme = useCallback((newTheme: Theme) => {
//     const css = document.createElement('style');
//     css.appendChild(document.createTextNode(
//       `* {
//         -webkit-transition: none !important;
//         -moz-transition: none !important;
//         -o-transition: none !important;
//         -ms-transition: none !important;
//         transition: none !important;
//       }`
//     ));
//     document.head.appendChild(css);

//     document.documentElement.classList.toggle('dark', newTheme === 'dark');
//     localStorage.setItem('theme', newTheme);

//     requestAnimationFrame(() => {
//       requestAnimationFrame(() => {
//         document.head.removeChild(css);
//       });
//     });
//   }, []);

//   // Apply theme on mount
//   useEffect(() => {
//     updateTheme(theme);
//   }, [theme, updateTheme]);

//   // Listen for system theme changes
//   useEffect(() => {
//     const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
//     const handleSystemThemeChange = (e: MediaQueryListEvent) => {
//       const hasManualPreference = localStorage.getItem("theme");
//       if (!hasManualPreference) {
//         const newTheme = e.matches ? "dark" : "light";
//         setTheme(newTheme);
//       }
//     };

//     mediaQuery.addEventListener("change", handleSystemThemeChange);
//     return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
//   }, []);

//   const toggle = useCallback(() => {
//     const newTheme = theme === "dark" ? "light" : "dark";
//     setTheme(newTheme);
//   }, [theme]);

//   return { 
//     theme, 
//     toggle, 
//     setTheme: setTheme,
//     themeScript 
//   };
// };

// export { themeScript };



import { useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark";

const DEFAULT_THEME: Theme = "dark";

const themeScript = `
  (function() {
    const theme = 'dark';
    const root = document.documentElement;
    root.style.setProperty('--initial-color-mode', theme);
    root.classList.add('dark');
    localStorage.setItem('theme', theme);
  })()
`;

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_THEME;
    }

    const saved = localStorage.getItem("theme") as Theme;
    if (saved === "light" || saved === "dark") {
      return saved;
    }

    // Always fallback to dark
    return DEFAULT_THEME;
  });

  const updateTheme = useCallback((newTheme: Theme) => {
    // Disable transitions during theme change
    const css = document.createElement("style");
    css.appendChild(document.createTextNode(
      `* {
        -webkit-transition: none !important;
        -moz-transition: none !important;
        -o-transition: none !important;
        -ms-transition: none !important;
        transition: none !important;
      }`
    ));
    document.head.appendChild(css);

    // Toggle class on root element
    document.documentElement.classList.toggle("dark", newTheme === "dark");

    // Save to localStorage
    localStorage.setItem("theme", newTheme);

    // Re-enable transitions after a frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.head.removeChild(css);
      });
    });
  }, []);

  useEffect(() => {
    updateTheme(theme);
  }, [theme, updateTheme]);

  const toggle = useCallback(() => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  }, []);

  return {
    theme,
    toggle,
    setTheme,
    themeScript,
  };
};

export { themeScript };
