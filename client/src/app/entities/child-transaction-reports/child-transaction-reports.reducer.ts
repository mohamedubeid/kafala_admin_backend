import axios from 'axios';
import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { ASC } from 'app/shared/util/pagination.constants';
import { cleanEntity } from 'app/shared/util/entity-utils';
import {
  IQueryParams,
  createEntitySlice,
  EntityState,
  serializeAxiosError,
  IChilTransactionQueryParams,
} from 'app/shared/reducers/reducer.utils';
import { IChildTransactionReports, defaultValue } from 'app/shared/model/child-transaction-reports.model';

const initialState: EntityState<IChildTransactionReports> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
  totalItems: 0,
};

const apiUrl = 'api/child-transaction-reports';
const apiUrlV2 = 'api/v2/child-transaction-reports';
// Actions

export const getEntities = createAsyncThunk(
  'childTransactionReports/fetch_entity_list',
  async ({ sort }: IQueryParams) => {
    const requestUrl = `${apiUrlV2}?${sort ? `sort=${sort}&` : ''}cacheBuster=${new Date().getTime()}`;
    return axios.get<IChildTransactionReports[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);
export const getChildTransactions = createAsyncThunk(
  'childTransactionReports/fetch_child_transactions',
  async ({ sort, childId, page, size, dateFrom, dateTo, status }: IChilTransactionQueryParams) => {
    const requestUrl = `${apiUrlV2}/admin/${childId}?${sort ? `sort=${sort}&` : ''}page=${page}&size=${size}&${dateFrom ? `dateFrom=${dateFrom}&` : ''}${dateTo ? `dateTo=${dateTo}&` : ''}${status ? `status=${status}&` : ''}cacheBuster=${new Date().getTime()}`;
    return axios.get<IChildTransactionReports[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const getEntity = createAsyncThunk(
  'childTransactionReports/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrlV2}/${id}`;
    return axios.get<IChildTransactionReports>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const createEntity = createAsyncThunk(
  'childTransactionReports/create_entity',
  async (entity: IChildTransactionReports, thunkAPI) => {
    const result = await axios.post<IChildTransactionReports>(apiUrlV2, cleanEntity(entity));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const updateEntity = createAsyncThunk(
  'childTransactionReports/update_entity',
  async (entity: IChildTransactionReports, thunkAPI) => {
    const result = await axios.put<IChildTransactionReports>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const partialUpdateEntity = createAsyncThunk(
  'childTransactionReports/partial_update_entity',
  async (entity: IChildTransactionReports, thunkAPI) => {
    const result = await axios.patch<IChildTransactionReports>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const deleteEntity = createAsyncThunk(
  'childTransactionReports/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrlV2}/${id}`;
    const result = await axios.delete<IChildTransactionReports>(requestUrl);
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

// slice

export const ChildTransactionReportsSlice = createEntitySlice({
  name: 'childTransactionReports',
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
      .addMatcher(isFulfilled(getChildTransactions), (state, action) => {
        const { data } = action.payload;
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
      .addMatcher(isPending(getEntities, getChildTransactions, getEntity), state => {
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

export const { reset } = ChildTransactionReportsSlice.actions;

// Reducer
export default ChildTransactionReportsSlice.reducer;
