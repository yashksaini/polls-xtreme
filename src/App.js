import { BrowserRouter, Switch } from "react-router-dom";
import Login from "./beforeLogin/Login";
import Signup from "./beforeLogin/Signup";
import Profile from "./afterLogin/Profile";
import Ranking from "./afterLogin/Ranking";
import Polls from "./afterLogin/Polls";
import UnprotectedRoute from "./UnprotectedRoute";
import ProtectedRoute from "./ProjectedRoute";
import AdminRoute from "./AdminRoute";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Poll from "./afterLogin/Poll";
import CreatePoll from "./adminPages/CreatePoll";

function App() {
  const auth = getAuth();
  // Get value from the localstorage if exists
  let tempValue = false;
  if (JSON.parse(localStorage.getItem("IsAuth")) !== null) {
    tempValue = JSON.parse(localStorage.getItem("IsAuth"));
  } else {
    localStorage.setItem("IsAuth", false);
  }

  // Initialize the isAuth Value
  const [isAuth, setIsAuth] = useState(tempValue);
  let userType = "user";
  const AuthUser = async () => {
    // User authentication code here
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuth(true);
        localStorage.setItem("IsAuth", true);
      } else {
        setIsAuth(false);
        localStorage.setItem("IsAuth", false);
      }
    });
  };

  useEffect(() => {
    AuthUser();
    // eslint-disable-next-line
  }, []);
  return (
    <BrowserRouter>
      <Switch>
        <UnprotectedRoute exact path="/" component={Login} isAuth={isAuth} />
        <UnprotectedRoute
          exact
          path="/login"
          component={Login}
          isAuth={isAuth}
          userType={userType}
        />
        <UnprotectedRoute
          exact
          path="/signup"
          component={Signup}
          isAuth={isAuth}
          userType={userType}
        />
        <ProtectedRoute
          exact
          path="/profile/:id"
          component={Profile}
          isAuth={isAuth}
          userType={userType}
        />
        <ProtectedRoute
          exact
          path="/ranking"
          component={Ranking}
          isAuth={isAuth}
          userType={userType}
        />
        <ProtectedRoute
          exact
          path="/poll/:id"
          component={Poll}
          isAuth={isAuth}
          userType={userType}
        />
        <ProtectedRoute
          exact
          path="/polls"
          component={Polls}
          isAuth={isAuth}
          userType={userType}
        />
        <AdminRoute
          exact
          path="/create"
          component={CreatePoll}
          isAuth={isAuth}
          userType={userType}
        />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
