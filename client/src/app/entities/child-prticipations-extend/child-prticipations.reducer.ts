import axios from 'axios';
import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { ASC } from 'app/shared/util/pagination.constants';
import { cleanEntity } from 'app/shared/util/entity-utils';
import {
  IQueryParams,
  createEntitySlice,
  EntityState,
  serializeAxiosError,
  IChilParticipationQueryParams,
} from 'app/shared/reducers/reducer.utils';
import { IChildPrticipations, defaultValue } from 'app/shared/model/child-prticipations.model';

const initialState: EntityState<IChildPrticipations> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
  totalItems: 0,
};

const apiUrl = 'api/child-prticipations';
const apiUrlV2 = 'api/v2/child-prticipations';
// Actions

export const getEntities = createAsyncThunk(
  'childPrticipations/fetch_entity_list',
  async ({ sort }: IQueryParams) => {
    const requestUrl = `${apiUrlV2}?${sort ? `sort=${sort}&` : ''}cacheBuster=${new Date().getTime()}`;
    return axios.get<IChildPrticipations[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);
export const getChildParticipations = createAsyncThunk(
  'childPrticipations/fetch_entity_list',
  async ({ sort, childId, page, size }: IChilParticipationQueryParams) => {
    const requestUrl = `${apiUrlV2}/admin/${childId}?${sort ? `sort=${sort}&` : ''}page=${page}&size=${size}&cacheBuster=${new Date().getTime()}`;
    return axios.get<IChildPrticipations[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const getEntity = createAsyncThunk(
  'childPrticipations/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrlV2}/${id}`;
    return axios.get<IChildPrticipations>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const createEntity = createAsyncThunk(
  'childPrticipations/create_entity',
  async (entity: IChildPrticipations, thunkAPI) => {
    const result = await axios.post<IChildPrticipations>(apiUrlV2, cleanEntity(entity));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const updateEntity = createAsyncThunk(
  'childPrticipations/update_entity',
  async (entity: IChildPrticipations, thunkAPI) => {
    const result = await axios.put<IChildPrticipations>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const partialUpdateEntity = createAsyncThunk(
  'childPrticipations/partial_update_entity',
  async (entity: IChildPrticipations, thunkAPI) => {
    const result = await axios.patch<IChildPrticipations>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const deleteEntity = createAsyncThunk(
  'childPrticipations/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrlV2}/${id}`;
    const result = await axios.delete<IChildPrticipations>(requestUrl);
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

// slice

export const ChildPrticipationsSlice = createEntitySlice({
  name: 'childPrticipations',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(getEntity.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addCase(deleteEntity.fulfilled, state => {
        state.updating = false;
        state.updateSuccess = true;
        state.entity = {};
      })
      .addMatcher(isFulfilled(getEntities), (state, action) => {
        const { data } = action.payload;
        return {
          ...state,
          loading: false,
          entities: data.sort((a, b) => {
            if (!action.meta?.arg?.sort) {
              return 1;
            }
            const order = action.meta.arg.sort.split(',')[1];
            const predicate = action.meta.arg.sort.split(',')[0];
            return order === ASC ? (a[predicate] < b[predicate] ? -1 : 1) : b[predicate] < a[predicate] ? -1 : 1;
          }),
        };
      })
      .addMatcher(isFulfilled(getChildParticipations), (state, action) => {
        const { data } = action.payload;
        console.log('data', data);

        return {
          ...state,
          loading: false,
          entities: data,
          totalItems: parseInt(action.payload.headers['x-total-count'], 10),
        };
      })

      .addMatcher(isFulfilled(createEntity, updateEntity, partialUpdateEntity), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = action.payload.data;
      })
      .addMatcher(isPending(getEntities, getChildParticipations, getEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.loading = true;
      })
      .addMatcher(isPending(createEntity, updateEntity, partialUpdateEntity, deleteEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
      });
  },
});

export const { reset } = ChildPrticipationsSlice.actions;

// Reducer
export default ChildPrticipationsSlice.reducer;
