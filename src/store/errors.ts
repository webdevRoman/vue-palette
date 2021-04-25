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

    // CLEAR_ERRORS(state: State) {
    //   state.errors = []
    // }
  },

  actions: {
    CHECK_FIELDS({commit}, fields: Field[]) {
      return new Promise((resolve, reject) => {
        const validationErrors: ValidationError[] = []
        fields.forEach(field => {
          field.validators.forEach(validator => {
            let validationError: ValidationError;
            switch (validator) {
              case Validator.EMPTY:
                validationError = {field, message: 'Заполните поле', validator: Validator.EMPTY}
                if (field.value?.toString.length) {
                  commit('REMOVE_ERROR', validationError)
                } else {
                  commit('ADD_ERROR', validationError)
                  validationErrors.push(validationError)
                }
                break
              default:
                console.error('No such validator')
                break;
            }
          })
          if (validationErrors.length) {
            reject(validationErrors)
          } else {
            resolve()
          }
        })
      })
    },

    REMOVE_ERROR({commit}, validationError: ValidationError) {
      commit('REMOVE_ERROR', validationError)
    },

    // CLEAR_ERRORS({commit}) {
    //   commit('CLEAR_ERRORS')
    // }
  },

  getters: {
    errors: (state: State) => state.errors
  }

}