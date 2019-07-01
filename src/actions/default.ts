import {
  IAction,
} from '../Interfaces';
import {
  Record,
} from 'immutable';

export default {};

export enum DefaultActionTypes {
  ADD_USER = 'ADD_USER',
  REMOVE_USER = 'REMOVE_USER',
  ADD_TODO = 'ADD_TODO',
  REMOVE_TODO = 'REMOVE_TODO',
  TOGGLE_TODO = 'TOGGLE_TODO',
  ADD_CAT_FACT = 'ADD_CAT_FACT',
}

export interface IUser {
  id: number;
  name: string;
}

export const UserFactory = Record<IUser>({
  id: -1,
  name: '',
});

export interface ITodo {
  id:  number;
  userId: number;
  title: string;
  completed: boolean;
}

export const TodoFactory = Record<ITodo>({
  id: -1,
  userId: -1,
  title: 'untitled',
  completed: false,
});

export class AddUserAction implements IAction {
  public readonly type = DefaultActionTypes.ADD_USER;
  constructor(
    public payload: {
      user: Record<IUser>,
    }
  ) {}
}

export class RemoveUserAction implements IAction {
  public readonly type = DefaultActionTypes.REMOVE_USER;
  constructor(
    public payload: {
      userId: number,
    }
  ) {}
}

export class AddTodoAction implements IAction {
  public readonly type = DefaultActionTypes.ADD_TODO;
  constructor(
    public payload: {
      userId: number,
      todo: Record<ITodo>,
    }
  ) {}
}

export class RemoveTodoAction implements IAction {
  public readonly type = DefaultActionTypes.REMOVE_TODO;
  constructor(
    public payload: {
      todoId: number,
    }
  ) { }
}

export class ToggleTodoAction implements IAction {
  public readonly type = DefaultActionTypes.TOGGLE_TODO;
  constructor(
    public payload: {
      todo: Record<ITodo>,
    }
  ) { }
}

export class AddCatFactAction implements IAction {
  public readonly type = DefaultActionTypes.ADD_CAT_FACT;
  constructor(
    public payload: {
      userId: number,
      todo: Record<ITodo>,
    }
  ) {}
}