// todo color theme
export default {
  primary: {
    'DEFAULT': '#eee',
    ':dark': '#222',

    'contrast': {
      'DEFAULT': '#222',
      ':dark': '#fafafa',

      'interactive': {
        'DEFAULT': '~',
        ':hover': 'accent',
        ':dark': '~',
        ':dark:hover': 'accent',
      },
    },
  },

  // secondary: {
  //   DEFAULT: 'rgba(40,40,40,.8)',
  //   ':dark': 'rgba(250,250,250,.9)',

  //   interactive: {
  //     DEFAULT: '~',
  //     ':hover': 'accent',
  //     ':dark': '~',
  //     ':dark:hover': 'accent',
  //   },
  // },

  accent: {
    DEFAULT: '#42b883',

    contrast: {
      'DEFAULT': '#fff',
      ':dark': '#333',
    },

    focus: {
      'DEFAULT': '#33a06f',
      ':dark': '#42d392',
    },

    interactive: {
      'DEFAULT': '~',
      ':hover': {
        'DEFAULT': 'accent-focus',
        ':dark': 'accent-focus:dark',
      },
      ':disabled': {
        'DEFAULT': '#999',
        ':dark': '#333',
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
      DEFAULT: '#ddd',

      interactive: {
        'DEFAULT': '~',
        ':hover': 'accent',
        ':disabled': {
          'DEFAULT': '#999',
          ':dark': '#333',
        },
      },
    },
  },

  error: '#d55',
};
