export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var theme = localStorage.getItem('theme');
              if (theme) {
                document.documentElement.classList.add(theme);
              } else {
                var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                document.documentElement.classList.add(systemTheme);
              }
            } catch (e) {
              // 로컬 스토리지 접근 실패 시 기본값 사용
              document.documentElement.classList.add('light');
            }
          })();
        `,
      }}
    />
  );
}
