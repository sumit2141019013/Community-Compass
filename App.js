import React from "react";
import StackNavigator from './navigation/StackNavigator';
import { UserContext } from "./UserContext";
const App = () => {
  return (
    <>
    <UserContext>
      <StackNavigator />
    </UserContext>
  </>
  );
};
export default App;

