import React from 'react';
import AppRoutes from "./router/AppRoutes";
import Header from "./components/Header";


function App() {
    return (
        <div className="App w-100p f-1 f-column gap-30">
            <Header/>
            <AppRoutes isAuth={false}/>
        </div>
    );
}

export default App;
