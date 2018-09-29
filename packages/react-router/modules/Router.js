import React from "react";
import PropTypes from "prop-types";
import warning from "warning";

import RouterContext from "./RouterContext";
import warnAboutGettingProperty from "./utils/warnAboutGettingProperty";
import scheduleCallback from "./utils/scheduleCallback";

function getContext(props, state) {
  return {
    history: props.history,
    location: state.location,
    match: Router.computeRootMatch(state.location.pathname),
    staticContext: props.staticContext
  };
}

/**
 * The public API for putting history on context.
 */
class Router extends React.Component {
  static computeRootMatch(pathname) {
    return { path: "/", url: "/", params: {}, isExact: pathname === "/" };
  }

  // TODO: Remove this
  static childContextTypes = {
    router: PropTypes.object.isRequired
  };

  // TODO: Remove this
  getChildContext() {
    const context = getContext(this.props, this.state);

    if (__DEV__) {
      const contextWithoutWarnings = { ...context };

      Object.keys(context).forEach(key => {
        warnAboutGettingProperty(
          context,
          key,
          `You should not be using this.context.router.${key} directly. It is private API ` +
            "for internal use only and is subject to change at any time. Instead, use " +
            "a <Route> or withRouter() to access the current location, match, etc."
        );
      });

      context._withoutWarnings = contextWithoutWarnings;
    }

    return {
      router: context
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      location: props.history.location
    };

    this.unlisten = props.history.listen(location => {
      if (process.env.NODE_ENV === "test") {
        this.setState({ location });
      } else {
        // Location updates get low priority so they
        // don't interfere with more important work.
        // TODO: How do we test this when the timing is
        // so unpredictable? Use immediate priority?
        scheduleCallback(() => {
          if (!this.isUnmounted) {
            this.setState({ location });
          }
        });
      }
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
    this.unlisten();
  }

  render() {
    const context = getContext(this.props, this.state);

    return (
      <RouterContext.Provider
        children={this.props.children || null}
        value={context}
      />
    );
  }
}

if (__DEV__) {
  Router.propTypes = {
    children: PropTypes.node,
    history: PropTypes.object.isRequired,
    staticContext: PropTypes.object
  };

  Router.prototype.componentDidUpdate = function(prevProps) {
    warning(
      prevProps.history === this.props.history,
      "You cannot change <Router history>"
    );
  };
}

export default Router;
