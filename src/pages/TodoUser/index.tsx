import React, { useState } from 'react';
import {
  compose,
  bindActionCreators,
  AnyAction,
  Dispatch,
} from 'redux';
import { IMatch } from '../../Interfaces';
import {
  getIn,
  Record,
  List,
} from 'immutable';
import { connect } from 'react-redux';
import {
  Grid,
  Typography,
  Button,
  TextField,
} from '@material-ui/core';
import {
  AddTodoAction,
  RemoveTodoAction,
  ToggleTodoAction,
  ITodo,
  TodoFactory,
  IUser,
} from '../../actions/default';
import {
  makeSelectTodosForUser,
  makeSelectUser,
} from '../../selectors/default';
import { createStructuredSelector } from 'reselect';

interface ITodoComponentProps {
  match: IMatch,
}

interface ITodoProps extends ITodoComponentProps {
  addTodo: (userId: number, todo: Record<ITodo>) => void;
  removeTodo: (todoId: number) => void;
  toggleTodo: (todo: Record<ITodo>) => void;
  userId: number;
  todosForUser: List<Record<ITodo>>;
  user?: Record<IUser>;
}


const addTodo = (userId: number, todo: Record<ITodo>) => new AddTodoAction({ userId, todo });
const removeTodo = (todoId: number) => new RemoveTodoAction({ todoId });
const toggleTodo = (todo: Record<ITodo>) => new ToggleTodoAction({ todo });

const Todo: React.FC<ITodoProps> = (props) => {
  const [textInput, setTextInput] = useState('');

  const {
    addTodo,
    removeTodo,
    toggleTodo,
    userId,
    todosForUser,
    user,
  } = props;
  if (user == null) {
    return (
      <Grid
        container={true}
        direction='column'
        wrap='nowrap'
      >
        <Grid
          item={true}
        >
          <Typography
            variant='h5'
          >
            INVALID USER
          </Typography>
        </Grid>
      </Grid>
    );
  }
  return (
    <Grid
      container={true}
      direction='column'
      wrap='nowrap'
    >
      <Grid
        item={true}
      >
        <Typography
          variant='h5'
        >
          TODOS FOR {user.get('name')}
        </Typography>
      </Grid>
      <Grid
        container={true}
        item={true}
        direction='column'
        wrap='nowrap'
      >
        <Grid
          item={true}
          container={true}
          alignItems='center'
        >
          <Grid
            item={true}
          >
            <TextField
              label='title'
              value={textInput}
              onChange={(e) => {
                setTextInput(e.target.value);
              }}
            />
          </Grid>
          <Grid
            item={true}
          >
            <Button
              variant='outlined'
              onClick={
                () => {
                  addTodo(
                    userId,
                    TodoFactory({
                      title: textInput,
                    }),
                  );
                  setTextInput('');
                }
              }
            >
              Add Todo
            </Button>
          </Grid>
        </Grid>
        {
          todosForUser.map((todo, index) => {
            return <Grid
              spacing={1}
              container={true}
              key={index}
              item={true}
            >
              <Grid
                key={index}
                item={true}
                className={todo.get('completed') ? 'strike-through' : ''}
                onClick={
                  () => {
                    toggleTodo(todo);
                  }
                }
              >
                {todo.get('title')}
              </Grid>
              <Grid
                item={true}
              >
                <Button
                  variant='outlined'
                  onClick={
                    () => {
                      removeTodo(todo.get('id'));
                    }
                  }
                >
                  Delete Task
                </Button>
              </Grid>
            </Grid>;
          })
        }
      </Grid>
    </Grid>
  );
}

const mapStateToProps = (state: any, props: ITodoComponentProps) => {
  const {
    match,
  } = props;
  const userId = parseInt(getIn(match, ['params', 'userId'], -1), 10); // from path / router
  return {
    userId,
    ...createStructuredSelector({
      todosForUser: makeSelectTodosForUser(userId),
      user: makeSelectUser(userId),
    })(state)
  }
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    ...bindActionCreators({ addTodo, removeTodo, toggleTodo }, dispatch)
  };
};


export default compose<React.ComponentClass<ITodoComponentProps>>(
  connect(mapStateToProps, mapDispatchToProps)
)(Todo);