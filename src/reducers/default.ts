import {
  fromJS,
  Record,
  OrderedMap, // changed from Map to OrderedMap so that entries remain in order after a deletion
  removeIn,
} from 'immutable';
import {
  IAction,
} from '../Interfaces';

import {
  DefaultActionTypes,
  ITodo,
  AddTodoAction,
  RemoveTodoAction,
  ToggleTodoAction,
  IUser,
  AddUserAction,
  RemoveUserAction,
  UserFactory,
  TodoFactory,
} from '../actions/default';

// import {
//   Settings,
// } from '../../models';

export interface IReducerState {
  lastUserId: number;
  lastTodoId: number;
  users: OrderedMap<number, Record<IUser>>;
  todos: OrderedMap<number, Record<ITodo>>;
}

const initialUsers = [
  UserFactory({
    id: 1,
    name: 'Ryan',
  }),
  UserFactory({
    id: 2,
    name: 'Sandy',
  }),
  UserFactory({
    id: 3,
    name: 'Sean',
  }),
  UserFactory({
    id: 4,
    name: 'Peter',
  }),
]

const initialTodos = [
  TodoFactory({
    id: 1,
    userId: 1,
    title: 'Drink Water',
  })
]

const INITIAL_STATE = fromJS({
  lastUserId: initialUsers.length,
  lastTodoId: initialTodos.length,
  users: OrderedMap<number, Record<IUser>>().withMutations((mutableMap) => {
    initialUsers.forEach((user) => {
      mutableMap.set(user.get('id'), user);
    })
  }),
  todos: OrderedMap<number, Record<ITodo>>().withMutations((mutableMap) => {
    initialTodos.forEach((todo) => {
      mutableMap.set(todo.get('id'), todo);
    })
  }),
});

export const reducer = (state: Record<IReducerState> = INITIAL_STATE, action: IAction) => {
  switch (action.type) {
    case DefaultActionTypes.ADD_USER: {
      const lastUserId = state.get('lastUserId');
      const {
        payload,
      } = action as AddUserAction;
      const {
        user,
      } = payload;

      if (user.get('name') === '') {
        console.debug('no name!')
        return state;
      }
      const userId = lastUserId + 1;
      return state.withMutations((mutableState) => {
        mutableState.set('lastUserId', userId);
        mutableState.setIn(
          ['users', userId],
          user.set('id', userId),
        );
      })
    }
    case DefaultActionTypes.REMOVE_USER: {
      // const lastUserId = state.get('lastUserId');
      const {
        payload,
      } = action as RemoveUserAction;
      const {
        userId,
      } = payload;

      return state.withMutations((mutableState) => {
        removeIn(mutableState, ['users', userId]); // removes the user

        mutableState.get('todos').forEach((todo) => { // remove all todo associated with the removed user
          if (todo.get('userId') === userId) {
            removeIn(mutableState, ['todos', todo.get('id')]);
          }
        });

        // for (let newId = userId + 1; newId <= lastUserId; newId++) {
        //   console.log(mutableState.getIn(['users', newId]));
        //   mutableState.setIn(
        //     ['users', newId],
        //     mutableState.getIn(['users', newId]).set('id', newId - 1),
        //   );
          // console.log(mutableState.get('users'));
        // };
        // mutableState.set('lastUserId', lastUserId - 1);
      });
    }
    case DefaultActionTypes.ADD_TODO: {
      const lastTodoId = state.get('lastTodoId');
      const {
        payload,
      } = action as AddTodoAction;
      const {
        userId,
        parentId,
        todo,
      } = payload;

      if (todo.get('title') === '') {
        console.debug('no title!')
        return state;
      }

      const todoId = lastTodoId + 1;
      return state.withMutations((mutableState) => {
        mutableState.set('lastTodoId', todoId);
        mutableState.setIn(
          ['todos', todoId],
          todo.withMutations((mutableTodo) => {
            mutableTodo.set('id', todoId)
            mutableTodo.set('parentId', parentId)
            mutableTodo.set('userId', userId)
          }),
        );
      });
    }
    case DefaultActionTypes.REMOVE_TODO: {
      const {
        payload,
      } = action as RemoveTodoAction;
      const {
        todoId,
      } = payload;

      return state.withMutations((mutableState) => {
        removeIn(mutableState, ['todos', todoId]);
      });
    }
    case DefaultActionTypes.TOGGLE_TODO: {
      const {
        payload,
      } = action as ToggleTodoAction;
      const {
        todo,
      } = payload;

      return state.withMutations((mutableState) => {
        mutableState.setIn(
          ['todos', todo.get('id')],
          todo.withMutations((mutableTodo) => {
            if (mutableTodo.get('completed')) {
              mutableTodo.set('completed', false)
            } else {
              mutableTodo.set('completed', true)
            }
          }),
        );
      });
    }
    default:
      return state;
  }
};

export default reducer;
