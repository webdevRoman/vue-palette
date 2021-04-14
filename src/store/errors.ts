import {State} from '@/store/State'

export enum Validator {
  EMPTY
}

export interface Field {
  name: string;
  value: string | number;
  validators: Validator[];
}

export interface ValidationError {
  field: Field;
  message?: string;
  validator?: Validator;
}

export default {

  state: () => ({
    errors: []
  }),

  mutations: {
    ADD_ERROR(state: State, error: ValidationError) {
      if (!state.errors.find(err => err.field.name === error.field.name)) {
        state.errors.push(error)
      }
    },

    REMOVE_ERROR(state: State, validationError: ValidationError) {
      // todo проверить
      const errInd = state.errors.findIndex(err => err.field.name === validationError.field.name &&
        (validationError.validator ? err.field.validators.some(errorVal => validationError.validator === errorVal) : true))
      if (errInd !== -1) {
        state.errors.splice(errInd, 1)
      }
    },

    CLEAR_ERRORS(state: State) {
      state.errors = []
    }
  },

  actions: {
    CHECK_FIELD({commit}, field: Field) {
      return new Promise((resolve, reject) => {
        field.validators.forEach(validator => {
          let validationError: ValidationError;
          switch (validator) {
            case Validator.EMPTY:
              validationError = {field, message: 'Заполните поле', validator: Validator.EMPTY}
              if (field.value) {
                commit('REMOVE_ERROR', validationError)
                resolve()
              } else {
                commit('ADD_ERROR', validationError)
                reject()
              }
              break
            default:
              reject('No such validator')
              break;
          }
        })
      })
    },

    REMOVE_ERROR({commit}, validationError: ValidationError) {
      commit('REMOVE_ERROR', validationError)
    },

    CLEAR_ERRORS({commit}) {
      commit('CLEAR_ERRORS')
    }
  },

  getters: {
    errors: (state: State) => state.errors
  }

}