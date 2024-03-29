import React, { useState } from 'react';
import { compose, bindActionCreators, AnyAction, Dispatch } from 'redux';
import { IMatch } from '../../Interfaces';
import {
  Record,
  Map,
} from 'immutable';
import { connect } from 'react-redux';
import { Grid, Typography, Button, TextField } from '@material-ui/core';
import {
  AddUserAction,
  RemoveUserAction,
  IUser,
  UserFactory,
} from '../../actions/default';
import {
  makeSelectUsers,
} from '../../selectors/default';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';

interface IUserListComponentProps {
  match: IMatch,
}

interface IUserListProps extends IUserListComponentProps {
  addUser: (user: Record<IUser>) => void;
  removeUser: (userId: number) => void;
  users: Map<number, Record<IUser>>;
}

const addUser = (user: Record<IUser>) => new AddUserAction({ user });
const removeUser = (userId: number) => new RemoveUserAction({ userId });

const UserList: React.FC<IUserListProps> = (props) => {
  const [textInput, setTextInput] = useState('');
  const [inputError, setInputError] = useState('');

  const {
    addUser,
    removeUser,
    users,
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
          Users
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
              label='name'
              required
              error={!!inputError}
              helperText={inputError}
              value={textInput}
              onChange={(e) => {
                setInputError('');
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
                  if (!textInput.trim()) {
                    setInputError('Please enter a non-empty name');
                  } else {
                    addUser(
                      UserFactory({
                        name: textInput,
                      }),
                    );
                    setTextInput('');
                  }
                }
              }
            >
              Add User
            </Button>
          </Grid>
        </Grid>
        {
          users.toList().map((user, userId) => {
            return <Grid
              spacing={1}
              container={true}
              key={userId}
              item={true}
            >
              <Grid
                item={true}
              >
                <Typography>
                  {userId + 1}:
                </Typography>
              </Grid>
              <Grid
                item={true}
              >
                <Typography>
                  {user.get('name')}
                </Typography>
              </Grid>
              <Grid
                item={true}
              >
                <Link
                  to={`/todo/${user.get('id')}`}
                >
                  <Typography>
                    todos
                  </Typography>
                </Link>
              </Grid>
              <Grid
                item={true}
              >
                <Button
                  variant='outlined'
                  onClick={
                    () => {
                      removeUser(user.get('id'));
                    }
                  }
                >
                  Remove User
                </Button>
              </Grid>
            </Grid>;
          }).valueSeq().toArray()
        }
      </Grid>
    </Grid>
  );
}

const mapStateToProps = createStructuredSelector({
  users: makeSelectUsers(),
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    ...bindActionCreators({ addUser, removeUser }, dispatch)
  };
};


export default compose<React.ComponentClass<IUserListComponentProps>>(
  connect(mapStateToProps, mapDispatchToProps)
)(UserList);