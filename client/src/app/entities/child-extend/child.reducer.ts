import axios from 'axios';
import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { ASC } from 'app/shared/util/pagination.constants';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { IQueryParams, createEntitySlice, EntityState, serializeAxiosError, IChildQueryParams } from 'app/shared/reducers/reducer.utils';
import { IChild, defaultValue } from 'app/shared/model/child.model';

const initialState: EntityState<IChild> = {
  loading: false,
  errorMessage: null,
  entities: [],
  invalidImportedChilds: [],
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
  totalItems: 0,
  updateSuccessImport: false,
  updatingImport: false,
  loadingImport: false,
  updateScoreSuccess: false,
  exportedData: [],
  fetchExportedDataSuccess: false,
};

const apiUrl = 'api/children';
const apiUrlV2 = 'api/v2/children';

// Actions

let isImportInProgress = false;

export const importChilds = createAsyncThunk(
  'child/import_child',
  async (entity: any[], thunkAPI) => {
    if (isImportInProgress) return;
    isImportInProgress = true;
    try {
      const result = await axios.post(`${apiUrlV2}/import/childs`, entity);
      thunkAPI.dispatch(getEntities({}));
      return result;
    } finally {
      isImportInProgress = false;
    }
  },
  { serializeError: serializeAxiosError },
);

export const getEntities = createAsyncThunk(
  'child/fetch_entity_list',
  async ({ sort, name, page, size, sponsershipType, orphanClassification, ageFrom, ageTo, dateFrom, dateTo, status }: IChildQueryParams) => {
    const requestUrl = `${apiUrlV2}/admin/getChilds?${sort ? `sort=${sort}&` : ''}${name ? `name=${name}&` : ''}${sponsershipType ? `sponerShipType=${sponsershipType}&` : ''}${orphanClassification ? `orphanClassification=${orphanClassification}&` : ''}${ageFrom !== undefined ? `ageFrom=${ageFrom}&` : ''}${ageTo !== undefined ? `ageTo=${ageTo}&` : ''}${dateFrom ? `dateFrom=${dateFrom}&` : ''}${dateTo ? `dateTo=${dateTo}&` : ''}${page !== undefined ? `page=${page}&` : ''}${size !== undefined ? `size=${size}&` : ''}${status ? `status=${status}&` : ''}cacheBuster=${new Date().getTime()}`;

    const response = await axios.get<IChild[]>(requestUrl);
    return {
      data: response.data,
      headers: response.headers,
    };
  },
  { serializeError: serializeAxiosError },
);

export const getExportedChildsData = createAsyncThunk(
  'child/get_exported_child_Data',
  async ({ sort, name, page, size, sponsershipType, orphanClassification, ageFrom, ageTo, dateFrom, dateTo, status }: IChildQueryParams) => {
    const requestUrl = `${apiUrlV2}/admin/getExportedChildData?${sort ? `sort=${sort}&` : ''}${name ? `name=${name}&` : ''}${sponsershipType ? `sponerShipType=${sponsershipType}&` : ''}${orphanClassification ? `orphanClassification=${orphanClassification}&` : ''}${ageFrom !== undefined ? `ageFrom=${ageFrom}&` : ''}${ageTo !== undefined ? `ageTo=${ageTo}&` : ''}${dateFrom ? `dateFrom=${dateFrom}&` : ''}${dateTo ? `dateTo=${dateTo}&` : ''}${page !== undefined ? `page=${page}&` : ''}${size !== undefined ? `size=${size}&` : ''}${status ? `status=${status}&` : ''}cacheBuster=${new Date().getTime()}`;

    const response = await axios.get<IChild[]>(requestUrl);
    return {
      data: response.data,
      headers: response.headers,
    };
  },
  { serializeError: serializeAxiosError },
);

export const getEntity = createAsyncThunk(
  'child/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrlV2}/${id}`;
    return axios.get<IChild>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const createUpdateEntity = createAsyncThunk(
  'child/create_entity',
  async ({ entity, queryParams }: { entity: IChild; queryParams?: IChildQueryParams }, thunkAPI) => {
    const result = await axios.put<IChild>(`${apiUrlV2}/addUpdateChild`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities(queryParams || {})); // Pass the queryParams to getEntities
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const createEntity = createAsyncThunk(
  'child/create_entity',
  async (entity: IChild, thunkAPI) => {
    const result = await axios.put<IChild>(`${apiUrlV2}/addUpdateChild`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const updateEntity = createAsyncThunk(
  'child/update_entity',
  async (entity: IChild, thunkAPI) => {
    const result = await axios.put<IChild>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const partialUpdateEntity = createAsyncThunk(
  'child/partial_update_entity',
  async (entity: IChild, thunkAPI) => {
    const result = await axios.patch<IChild>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const deleteEntity = createAsyncThunk(
  'child/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrlV2}/${id}`;
    const result = await axios.delete<IChild>(requestUrl);
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError },
);

export const updateScore = createAsyncThunk(
  'child/update_score',
  async ({ childId, score }: { childId: string | number; score: number }, thunkAPI) => {
    const requestUrl = `${apiUrlV2}/child/updateScore`;
    const response = await axios.put<IChild>(requestUrl, { childId, score });
    thunkAPI.dispatch(getEntities({}));
    return response.data;
  },
  { serializeError: serializeAxiosError },
);

// Slice

export const ChildSlice = createEntitySlice({
  name: 'child',
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
      .addCase(importChilds.fulfilled, state => {
        state.updatingImport = false;
        state.updateSuccessImport = true;
        state.loadingImport = false;
      })
      .addCase(updateScore.fulfilled, state => {
        state.updating = false;
        state.updateSuccess = true;
        state.entity = {};
      })
      .addCase(getExportedChildsData.fulfilled, state => {
        state.updating = false;
        state.fetchExportedDataSuccess = true;
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
          totalItems: parseInt(action.payload.headers['x-total-count'], 10),
        };
      })
      .addMatcher(isFulfilled(getExportedChildsData), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          loading: false,
          fetchExportedDataSuccess: true,
          exportedData: data.sort((a, b) => {
            if (!action.meta?.arg?.sort) {
              return 1;
            }
            const order = action.meta.arg.sort.split(',')[1];
            const predicate = action.meta.arg.sort.split(',')[0];
            return order === ASC ? (a[predicate] < b[predicate] ? -1 : 1) : b[predicate] < a[predicate] ? -1 : 1;
          }),
          totalItems: parseInt(action.payload.headers['x-total-count'], 10),
        };
      })

      .addMatcher(isFulfilled(createEntity, updateEntity, partialUpdateEntity), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = action.payload.data;
      })
      .addMatcher(isFulfilled(importChilds), (state, action) => {
        state.updateSuccessImport = false;
        state.loadingImport = false;
        state.updateSuccessImport = true;
        state.invalidImportedChilds = action.payload?.data;
      })
      .addMatcher(isFulfilled(updateScore), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateScoreSuccess = true;
      })
      .addMatcher(isPending(getEntities, getEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.loading = true;
      })
      .addMatcher(isPending(getExportedChildsData, getEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.fetchExportedDataSuccess = false;
        state.loading = true;
      })
      .addMatcher(isPending(createEntity, updateEntity, partialUpdateEntity, deleteEntity, updateScore), state => {
        // Include updateScore here
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
      })
      .addMatcher(isPending(importChilds), state => {
        state.errorMessage = null;
        state.updateSuccessImport = false;
        state.updatingImport = true;
        state.loadingImport = true;
      });
  },
});

export const { reset } = ChildSlice.actions;

// Reducer
export default ChildSlice.reducer;
