import React from 'react';
import {Nav} from "./Components/Molekules/Nav";
import items from "./Utils/navItems.json";

function App() {
  return (
    <div>
      <Nav items={items} />
    </div>
  );
}

export default App;
