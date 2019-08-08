import React from 'react';

export const AppContext = React.createContext({});

export class AppProvider extends React.Component {
    // Listen to the Firebase Auth state and set the local state.
    componentDidMount() {}
    
    // Make sure we un-register Firebase observers when the component unmounts.
    componentWillUnmount() {}

    render () {
        return (
            <AppContext.Provider value={{}}>
                {this.props.children}
            </AppContext.Provider>
        )
    }
};

export const AppConsumer = AppContext.Consumer;