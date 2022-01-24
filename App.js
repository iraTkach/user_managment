import { Component }  from "react";
import logo from './logo.svg';
import './App.css';
import PropsComp from './PropsComp';
import Users from './users'

function App() {
  return (
    <div>
        {/* <PropsComp name="Moshe1" age="23" />
        <PropsComp name="Moshe2" age="29" />
        <PropsComp name="Moshe3" age="21" /> */}
        <Users/>

      </div>
  );
}

export default App;
