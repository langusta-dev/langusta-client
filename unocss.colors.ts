// todo color theme
export default {
  primary: {
    'DEFAULT': '#fafafa',
    ':dark': '#eee',

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

    contrast: {
      'DEFAULT': '#fff',
      ':dark': '#333',
    },

    focus: {
      'DEFAULT': '#bb0022',
      ':dark': '#e5405e',
    },

    interactive: {
      'DEFAULT': '~',
      ':hover': {
        'DEFAULT': 'accent-focus',
        ':dark': 'accent-focus:dark',
      },

      'contrast': {
        'DEFAULT': 'accent-contrast',
        ':dark': 'accent-contrast:dark',
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
