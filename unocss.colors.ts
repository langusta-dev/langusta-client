// todo color theme
export default {
  primary: {
    'DEFAULT': '#fafafa',
    ':dark': '#222',

    'contrast': {
      'DEFAULT': '#111',
      ':dark': '#eee',

      'interactive': {
        'DEFAULT': '~',
        ':hover': 'accent',
        ':dark': {
          'DEFAULT': '~',
          ':hover': 'accent',
        },
      },
    },
  },

  accent: {
    DEFAULT: '#d9293d',

    contrast: {
      'DEFAULT': '#fff',
      ':dark': '#222',
    },

    focus: {
      'DEFAULT': '#ae2131',
      ':dark': '#df495a',
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
      'DEFAULT': 'primary',
      ':dark': 'primary:dark',

      'interactive': {
        'DEFAULT': 'primary',
        ':dark': 'primary:dark',

        ':hover': {
          'DEFAULT': 'accent',
          ':dark': 'accent',
        },

        'contrast': {
          'DEFAULT': 'accent',

          ':hover': {
            'DEFAULT': 'primary',
            ':dark': 'primary:dark',
          },
        },
      },
    },
  },

  error: '#f33',
};
