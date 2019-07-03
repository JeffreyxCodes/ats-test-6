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
  addTodo: (userId: number, parentId: number, todo: Record<ITodo>) => void;
  removeTodo: (todoId: number) => void;
  toggleTodo: (todo: Record<ITodo>) => void;
  userId: number;
  todosForUser: List<Record<ITodo>>;
  user?: Record<IUser>;
}


const addTodo = (userId: number, parentId: number, todo: Record<ITodo>) => new AddTodoAction({ userId, parentId, todo });
const removeTodo = (todoId: number) => new RemoveTodoAction({ todoId });
const toggleTodo = (todo: Record<ITodo>) => new ToggleTodoAction({ todo });

const Todo: React.FC<ITodoProps> = (props) => {
  const [textInput, setTextInput] = useState('');
  // const [subTextInput, setSubTextInput] = useState('');

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
              label='title of task / sub-task'
              required
              error={!textInput}
              helperText={!textInput ? "Please enter a non-empty title" : ''}
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
              disabled={textInput ? false : true}
              onClick={
                () => {
                  addTodo(
                    userId,
                    -1,
                    TodoFactory({
                      title: textInput,
                    }),
                  );
                  setTextInput('');
                }
              }
            >
              Add Task
            </Button>
          </Grid>
        </Grid>
        {
          todosForUser.filter(todo => todo.get('parentId') === -1).toList().map((todo, index) => {
            return <Grid
              spacing={1}
              container={true}
              key={index}
              item={true}
              alignItems="center"
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
                  disabled={textInput ? false : true}
                  onClick={
                    () => {
                      addTodo(
                        userId,
                        todo.get('id'),
                        TodoFactory({
                          title: textInput,
                        }),
                      );
                      setTextInput('');
                    }
                  }
                >
                  Add Sub-Task
                </Button>
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

              {
                todosForUser.filter(subTodo => subTodo.get('parentId') === todo.get('id')).toList().map((todo) => {
                  return (
                    <Grid
                      spacing={1}
                      container={true}
                      key={todo.get('id')}
                      item={true}
                      alignItems="center"
                    >
                      <Grid
                        key={todo.get('id')}
                        item={true}
                        className={todo.get('completed') ? 'strike-through' : ''}
                        onClick={
                          () => {
                            toggleTodo(todo);
                          }
                        }
                      >
                        {'--> ' + todo.get('title')}
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
                          Delete Sub-Task
                        </Button>
                      </Grid>
                    </Grid>
                  )
                })
              }

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