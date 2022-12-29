// todo color theme
export default {
  primary: {
    'DEFAULT': '#fafafa',
    ':dark': '#fafafa',

    'contrast': {
      'DEFAULT': '#111',
      ':dark': '#111',

      'interactive': {
        'DEFAULT': '~',
        ':hover': 'accent',
        ':dark': '~',
        ':dark:hover': 'accent',
      },
    },
  },

  accent: {
    DEFAULT: '#dc0028',

    contrast: '#fff',

    focus: {
      'DEFAULT': '#bb0022',
      ':dark': '#e5405e',
    },

    interactive: {
      'DEFAULT': '~',
      ':hover': 'accent-focus',

      'contrast': {
        'DEFAULT': 'accent-contrast',
        ':disabled': {
          'DEFAULT': '#f1f1f1',
          ':dark': '#888',
        },
      },
    },

    alt: {
      DEFAULT: 'primary',

      interactive: {
        'DEFAULT': '~',
        ':hover': 'accent',

        'contrast': {
          'DEFAULT': 'accent',
          ':hover': 'accent-contrast',
        },
      },
    },
  },

  error: '#f33',
};
