import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';

import Landing from './Landing';
import SignIn from './SignIn';
import LogOut from './LogOut';
import AppHome from './AppHome';
import CreateQuiz from './CreateQuiz';
import ViewQuiz from './ViewQuiz';
import QuizList from './QuizList';

const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact component={Landing} />
      <Route path="/sign-in/" exact component={SignIn} />
      <Route path="/log-out/" exact component={LogOut} />
      <Route path="/app/" exact component={AppHome} />
      <Route path="/app/quizzes/create/" exact component={CreateQuiz} />
      <Route path="/app/quizzes/take/:quizId/" exact 
        component={props => <ViewQuiz isTake={true} isView={false} {...props} />} />
      <Route path="/app/quizzes/view/:quizId/" exact
        component={props => <ViewQuiz isView={true} isTake={false} {...props} />} />
      <Route path="/app/quizzes/list/" exact component={QuizList} />
    </Switch>
  )
};

export default Routes;