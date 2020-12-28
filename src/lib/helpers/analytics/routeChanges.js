export default function routeChange(callback) {
    const { addEventListener, history, location } = window
    addEventListener('popstate', () => {
      callback(location.pathname)
    })
    const methods = ['push', 'replace']
    methods.map(type => {
      const state = `${type}State`;
      const historyState = history[state];
      history[state] = function() {
        callback(arguments[2])
        return historyState.apply(history, arguments);
      }

      return null;
    })
  } 