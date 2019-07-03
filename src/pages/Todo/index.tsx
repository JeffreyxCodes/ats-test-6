import React from 'react';
import { compose } from 'redux';
import { IMatch } from '../../Interfaces';
import {
  Record,
  Map,
} from 'immutable';
import { connect } from 'react-redux';
import { Grid, Typography } from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import { makeSelectTodos } from '../../selectors/default';
import { ITodo } from '../../actions/default';
import { Link } from 'react-router-dom';

interface ITodoComponentProps {
  match: IMatch,
}

interface ITodoProps extends ITodoComponentProps {
  todos: Map<number, Record<ITodo>>
}

const Todo: React.FC<ITodoProps> = (props) => {
  const {
    todos,
  } = props;
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
          TODO
        </Typography>
      </Grid>
      <Grid
        container={true}
        item={true}
        direction='column'
        alignItems="flex-start"
        wrap='nowrap'
      >
        {
          todos.filter(todo => todo.get('parentId') === -1).toList().map((todo, todoId) => {
            const userId = todo.get('userId');
            return <Grid
              container={true}
              item={true}
              direction='column'
              alignItems="flex-start"
              wrap='nowrap'
            >
              <Grid
                key={todoId}
                item={true}
                className={todo.get('completed') ? 'strike-through' : ''}
              >
                <Link
                  to={`/todo/${userId}`}
                >
                  {todoId}: {todo.get('title')}
                </Link>
              </Grid>

              {
                todos.filter(subTodo => subTodo.get('parentId') === todo.get('id')).toList().map((todo) => {
                  return (
                    <Grid
                      key={todo.get('id')}
                      item={true}
                      className={todo.get('completed') ? 'strike-through' : ''}
                    >
                      --> {todo.get('title')}
                    </Grid>
                  )
                })
              }

            </Grid>;
          }).valueSeq().toArray()
        }
      </Grid>
    </Grid>
  );
}

const mapStateToProps = createStructuredSelector({
  todos: makeSelectTodos(),
});


export default compose<React.ComponentClass<ITodoComponentProps>>(
  connect(mapStateToProps, null)
)(Todo);