import React , {useContext} from 'react';
import {Route, Redirect} from 'react-router-dom'; 
import { AuthContext } from "./auth"

export default function ProtectedRoute({compoent:Component, ...rest}) {
  const {signIn, user} = useContext(AuthContext)
  console.log(signIn)
  return (
    <Route
      {...rest}
      render={props => {
        if (signIn){
          return <Component {...props} />
        } else{
          return <Redirect to={{pathname:"/",state:{from:props.location,},}} />
        }
        // return user ? (
        //   <Component {...props}  />
        // ) : (
        //   <Redirect
        //     to={{
        //       pathname: "/",
        //       state: {
        //         from: props.location,
        //       },
        //     }}
        //   />
        // );
      }}
    />
  )
}