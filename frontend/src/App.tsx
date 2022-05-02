import React from 'react';
import style from "./App.module.css";
import {Header} from "./Components/Organisms/Header";

function App() {
  return (
    <div className={style.container}>
        <div className={style.wrapper}>
            <Header />
        </div>
    </div>
  );
}

export default App;
