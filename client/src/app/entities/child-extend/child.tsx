import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Row, Table } from 'reactstrap';
import { JhiItemCount, JhiPagination, Translate, getSortState, translate } from 'react-jhipster';
import { ASC, DESC, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams, overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Dropdown, Modal, ProgressBar } from 'react-bootstrap';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown as AntdDropdown, Space, MenuProps, Pagination, DatePicker, Upload } from 'antd';
import localeAr from 'antd/es/date-picker/locale/ar_EG';
import localeEn from 'antd/es/date-picker/locale/en_US';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import * as XLSX from 'xlsx';

import { createEntity, createUpdateEntity, getEntities, getExportedChildsData, importChilds, reset } from './child.reducer';
import { UploadOutlined } from '@ant-design/icons';
import { read, utils } from 'xlsx';
import { toast } from 'react-toastify';
import { ChildStatus } from 'app/shared/model/enumerations/child-status.model';
import ChangeChildStatusModal from './change-child-status-modal';

const { RangePicker } = DatePicker;
export const Child = (props: any) => {
  const dispatch = useAppDispatch();
  const pageLocation = useLocation();
  const [showMoreFilters, setShowMoreFilters] = useState<boolean>(false);
  const navigate = useNavigate();
  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(pageLocation, 'id'), pageLocation.search));

  const childList = useAppSelector(state => state.child.entities);
  const exportedChildData = useAppSelector(state => state.child.exportedData);
  const fetchExportedDataSuccess = useAppSelector(state => state.child.fetchExportedDataSuccess);
  const updateSuccess = useAppSelector(state => state.child.updateSuccess);
  const loading = useAppSelector(state => state.child.loading);
  const currentLocale = useAppSelector(state => state.locale.currentLocale);
  const totalItems = useAppSelector(state => state.child.totalItems);
  // invalid imported childs
  const invalidImportedChilds = useAppSelector(state => state.child.invalidImportedChilds);
  const [isFetchExportetDataSuccess, setIsFetchExportedDataSuccess] = useState(false);
  const [isExportCanceled, setIsExportCanceled] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [importProgress, setImportProgress] = useState<number>(0);
  const [show, setShow] = useState(false);
  const [showProgress, setshowProgress] = useState<boolean>(false);
  const [disableExportButton, setDisableExportButton] = useState(false);
  const [exportData, setExportData] = useState([]);
  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(
      {
        activePage: 1,
        itemsPerPage: ITEMS_PER_PAGE,
        sort: sortState.sort,
        order: sortState.order,
      },
      pageLocation.search,
    ),
  );
  //filters
  const params = new URLSearchParams(pageLocation.search);

  //name filter..
  const getName = params.get('name');
  const [name, setName] = useState(getName);

  //sponsorship filter..
  const [sponsershipType, setSponsorshipType] = useState(translate('kafalaApp.child.All'));
  const [sponsorshipKey, setSponsorshipKey] = useState('');

  //orphanClassification filter..
  const [orphanClassification, setOrphanClassification] = useState(translate('kafalaApp.child.All'));
  const [orphanClassificationKey, setOrphanClassificationKey] = useState('');

  //ageRange filter..
  const [ageRange, setAgeRange] = useState(translate('kafalaApp.child.All'));
  const [ageFrom, setAgeFrom] = useState(null);
  const [ageTo, SetAgeTo] = useState(null);
  const [ageRangeKey, setAgeRangeKey] = useState(null);

  //date filter
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [dataImported, setDataImported] = useState(false);

  //created by filter
  const [createdBy, setCreatedBy] = useState<string | null>(null);

  // status filter
  const [status, setStatus] = useState(translate('kafalaApp.child.All'));
  const [statusKey, setStatusKey] = useState<ChildStatus | null>();
  //use effects
  useEffect(() => {
    const sponsershipType = params.get('sponsershipType');
    const orphanClassification = params.get('orphanClassification');
    // set sponsership type with current local
    if (sponsershipType !== 'null' && sponsershipType) {
      setSponsorshipType(translate(`kafalaApp.child.${sponsershipType}`));
    } else {
      setSponsorshipType(translate('kafalaApp.child.All'));
    }
    // set orphan classification type with current local
    if (orphanClassification !== 'null' && orphanClassification) {
      setOrphanClassification(translate(`kafalaApp.child.${orphanClassification}`));
    } else {
      setOrphanClassification(translate('kafalaApp.child.All'));
    }
    // set orphan classification type with current local
    if (ageRangeKey !== 'null' && ageRangeKey) {
      setAgeRange(translate(`kafalaApp.child.${ageRangeKey}`));
    } else {
      setAgeRange(translate('kafalaApp.child.All'));
    }
  }, [currentLocale]);

  // date filter
  const formatDateTime = date => {
    if (!date) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleChangeDate = dates => {
    const dateFrom = dates && dates[0] ? formatDateTime(new Date(dates[0])) : '';
    const dateTo = dates && dates[1] ? formatDateTime(new Date(dates[1])) : '';
    setDateFrom(dateFrom);
    setDateTo(dateTo);
  };
  const removeDuplicateIds = (items: any[]) => {
    const seenIds = new Set<string>();
    const uniqueItems = items.filter(item => {
      if (item?.id && seenIds.has(item?.id)) {
        return false;
      }
      seenIds.add(item?.id);
      return true;
    });
    return uniqueItems;
  };
//handle change child status
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState<boolean>(false);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState<ChildStatus>(ChildStatus.PENDING);

  const openChangeStatusModal = (child: any) => {
    setSelectedChild(child);
    setSelectedStatus(child.status as ChildStatus);
    setIsChangeStatusModalOpen(true);
  };

  const closeChangeStatusModal = () => {
    setIsChangeStatusModalOpen(false);
  };

  const saveChildStatus = (newStatus: ChildStatus) => {
    if (selectedChild) {
      const updatedChild = {
        ...selectedChild,
        status: newStatus,
      };
      const queryParams = {
        sort: `${sortState.sort},${sortState.order}`,
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        name: name || '',
        sponsershipType: sponsorshipKey || '',
        orphanClassification: orphanClassificationKey || '',
        ageFrom: ageFrom || null,
        ageTo: ageTo || null,
        dateFrom: dateFrom || '',
        dateTo: dateTo || '',
        status: statusKey || null,
        createdBy: createdBy || ''
      };
  
      dispatch(createUpdateEntity({ entity: updatedChild, queryParams }));
    }
  };

  useEffect(() => {}, [exportedChildData]);
  const handleClose = () => {
    setShow(false);
    setDisableExportButton(false);
    setshowProgress(false);
    // setExportData([]);
    setIsExportCanceled(true);
    setPageIndex(0);
  };
  const exportToExcel = async () => {
    const fileName = `childs-data.xlsx`;
    if (!exportData || exportData.length === 0) {
      return;
    }
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
    worksheet.columns = [
      { header: `${translate('kafalaApp.child.childName')} *`, key: 'name', width: 40, style: { alignment: { horizontal: 'center' } } },

      { header: `${translate('kafalaApp.child.gender')} *`, key: 'gender', width: 40, style: { alignment: { horizontal: 'center' } } },
      { header: `${translate('kafalaApp.child.age')} *`, key: 'age', width: 40, style: { alignment: { horizontal: 'center' } } },
      {
        header: `${translate('kafalaApp.child.sponsershipType')} *`,
        key: 'sponsershipType',
        width: 40,
        style: { alignment: { horizontal: 'center' } },
      },
      {
        header: translate('kafalaApp.childMaritalStatus.orphanClassification'),
        key: 'orphanClassification',
        width: 40,
        style: { alignment: { horizontal: 'center' } },
      },

      {
        header: `${translate('kafalaApp.childSponsorShip.minimumCost')} *`,
        key: 'minimumCost',
        width: 40,
        style: { alignment: { horizontal: 'center' } },
      },
      {
        header: `${translate('kafalaApp.child.score')} *`,
        key: 'score',
        width: 40,
        style: { alignment: { horizontal: 'center' } },
      },
      {
        header: `${translate('kafalaApp.child.collectedUntilNow')} *`,
        key: 'collectedUntilNow',
        width: 40,
        style: { alignment: { horizontal: 'center' } },
      },
      {
        header: `${translate('kafalaApp.child.sponsorshipName')} *`,
        key: 'sponsorshipName',
        width: 40,
        style: { alignment: { horizontal: 'center' } },
      },
    ];

    exportData.forEach(item => {
      worksheet.addRow({
        name: item.firstName + (item.fatherName ? ' ' + item.fatherName : '') + (item.familyName ? ' ' + item.familyName : ''),
        gender: translate(`kafalaApp.Gender.${item.gender}`),
        age: item.age,
        sponsershipType: item.childSponsorShip?.relSponsershipTypes
          ?.map(relType => translate(`kafalaApp.child.${relType.sponsershipType.type}`))
          .join(', '),

        orphanClassification: item?.childMaritalStatus?.orphanClassification
          ? translate(
              `kafalaApp.child.${item?.childMaritalStatus?.orphanClassification !== 'OTHER' ? item.childMaritalStatus.orphanClassification : 'MOTHER_AND_FATHER'}`,
            )
          : '',
        minimumCost: item?.childSponsorShip?.minimumCost,
        score: item?.score,
        collectedUntilNow: item?.totalCost,
        sponsorshipName: item?.childSponsorShip?.name,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, fileName);
  };
  const prepareDataToExport = () => {
    setDisableExportButton(true);
    if (exportData.length > 0) {
      setshowProgress(true);
    }
    setShow(true);
    setIsExportCanceled(false);
    setPageIndex(0);
    setExportData([]);
    // Initial dispatch to get exported data
    dispatch(
      getExportedChildsData({
        sort: `${sortState.sort},${sortState.order}`,
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        name: name || '',
        sponsershipType: sponsorshipKey || '',
        orphanClassification: orphanClassificationKey || '',
        ageFrom: ageFrom || null,
        ageTo: ageTo || null,
        dateFrom: dateFrom || '',
        dateTo: dateTo || '',
        status: statusKey || null,
        createdBy: createdBy || ''
      }),
    );
  };
  useEffect(() => {
    if (isFetchExportetDataSuccess && exportData.length < totalItems && !isExportCanceled) {
      dispatch(
        getExportedChildsData({
          sort: `${sortState.sort},${sortState.order}`,
          page: pageIndex,
          size: paginationState.itemsPerPage,
          name: name || '',
          sponsershipType: sponsorshipKey || '',
          orphanClassification: orphanClassificationKey || '',
          ageFrom: ageFrom || null,
          ageTo: ageTo || null,
          dateFrom: dateFrom || '',
          dateTo: dateTo || '',
          status: statusKey || null,
          createdBy: createdBy || ''
        }),
      );

      setIsFetchExportedDataSuccess(false);
      setPageIndex(prevIndex => prevIndex + 1);
    }
  }, [isFetchExportetDataSuccess]);

  useEffect(() => {
    if (fetchExportedDataSuccess) {
      console.log('fetchExportedDataSuccess detected:', fetchExportedDataSuccess);
      setIsFetchExportedDataSuccess(true);
      dispatch({ type: 'child/resetFetchExportedDataSuccess' });
    }
  }, [fetchExportedDataSuccess]);
  useEffect(() => {
    if (importProgress === 100) {
      handleClose();
    }
  }, [importProgress]);

  useEffect(() => {
    console.log('exportData', exportData);

    if (exportData.length === totalItems) {
      setDisableExportButton(false);
    }
  }, [exportData]);

  useEffect(() => {
    if (pageIndex === 1 && totalItems) {
      setIsFetchExportedDataSuccess(true);
    }
  }, [totalItems, currentLocale]);

  useEffect(() => {
    if (fetchExportedDataSuccess) {
      const uniqueExportData = removeDuplicateIds([...exportData, ...exportedChildData]);
      console.log('uniqueExportData', uniqueExportData);

      if (uniqueExportData.length === 0) {
        toast.warning(translate('global.noDataToExport'));
        setshowProgress(false);
        handleClose();
        return;
      }

      setExportData(uniqueExportData);

      // Calculate progress only if there's data
      const progress = Math.ceil((uniqueExportData.length / totalItems) * 100) || 0;
      setImportProgress(progress);

      if (progress === 100) {
        exportToExcel();
        handleClose();
      }
    }
  }, [exportedChildData, fetchExportedDataSuccess]);

  useEffect(() => {
    console.log('totalItems', totalItems);
    console.log('exportData.length', exportData.length);

    if (exportData.length === totalItems) {
      setImportProgress(100);
      exportToExcel();
    }
  }, [exportData]);

  useEffect(() => {
    console.log('fetchExportedDataSuccess', fetchExportedDataSuccess);
    setIsFetchExportedDataSuccess(fetchExportedDataSuccess);
  }, [fetchExportedDataSuccess]);
  useEffect(() => {
    getAllEntities();
  }, [
    sortState.order,
    sortState.sort,
    paginationState.activePage,
    paginationState.itemsPerPage,
    name,
    sponsershipType,
    orphanClassification,
    dateFrom,
    dateTo,
    updateSuccess,
    statusKey,
    createdBy
  ]);
  useEffect(() => {
    setName('');
    setOrphanClassificationKey(null);
    setSponsorshipKey(null);
  }, []);

  useEffect(() => {
    if (paginationState.activePage !== 1 || paginationState.itemsPerPage !== ITEMS_PER_PAGE) {
      const endURL = `${pageLocation.pathname}?page=${paginationState.activePage}&size=${paginationState.itemsPerPage}&sort=${sortState.sort},${sortState.order}`;
      if (pageLocation.search !== endURL) {
        navigate(endURL);
      }
    }
    filter();
  }, [
    paginationState.activePage,
    paginationState.itemsPerPage,
    sortState.sort,
    sortState.order,
    name,
    sponsershipType,
    orphanClassification,
    ageRange,
    dateFrom,
    dateTo,
    statusKey,
    createdBy
  ]);

  useEffect(() => {
    setPaginationState({
      ...paginationState,
      activePage: 1,
    });
  }, [name, sponsershipType, orphanClassification, ageRange, dateFrom, dateTo, statusKey, createdBy]);

  function filter() {
    let endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (name && name.length > 0) {
      endURL += `&name=${name}`;
    }
    if (sponsorshipKey) {
      endURL += `&sponsershipType=${sponsorshipKey}`;
    }
    if (orphanClassificationKey) {
      endURL += `&orphanClassification=${orphanClassificationKey}`;
    }
    if (ageRange) {
      endURL += `&ageRange=${ageRange}`;
    }
    if (statusKey) {
      endURL += `&status=${statusKey}`;
    }

    if (createdBy && createdBy.length > 0) {
      endURL += `&createdBy=${createdBy}`;
    }

    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
      dispatch(
        getEntities({
          sort: `${sortState.sort},${sortState.order}`,
          page: paginationState.activePage - 1,
          size: paginationState.itemsPerPage,
          name: name || '',
          sponsershipType: sponsorshipKey || '',
          orphanClassification: orphanClassificationKey || '',
          ageFrom: ageFrom,
          ageTo: ageTo,
          dateFrom: dateFrom || '',
          dateTo: dateTo || '',
          status: statusKey || null,
          createdBy: createdBy || '',
        }),
      );
    }
  }
  //status filter options
  function statusOptions() {
    const statusItems: MenuProps['items'] = [
      {
        label: `  ${translate('kafalaApp.child.All')}`,
        key: '1',
        onClick() {
          setStatus(translate('kafalaApp.child.All'));
          setStatusKey(null);
        },
      },
      {
        label: ` ${translate('kafalaApp.ChildStatus.PENDING')}`,
        key: '2',
        onClick() {
          setStatus(translate('kafalaApp.ChildStatus.PENDING'));
          setStatusKey('PENDING' as ChildStatus);
        },
      },
      {
        label: ` ${translate('kafalaApp.ChildStatus.APPROVED')}`,
        key: '3',
        onClick() {
          setStatus(translate('kafalaApp.ChildStatus.APPROVED'));
          setStatusKey('APPROVED' as ChildStatus);
        },
      },
      {
        label: ` ${translate('kafalaApp.ChildStatus.REJECTED')}`,
        key: '4',
        onClick() {
          setStatus(translate('kafalaApp.ChildStatus.REJECTED'));
          setStatusKey('REJECTED' as ChildStatus);
        },
      },
    ];
    return statusItems;
  }
  // functions
  const handlePagination = currentPage => {
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });
  };
  const getAllEntities = () => {
    dispatch(
          getEntities({
            sort: `${sortState.sort},${sortState.order}`,
            page: paginationState.activePage - 1,
            size: paginationState.itemsPerPage,
            name: name || '',
            sponsershipType: sponsorshipKey || '',
            orphanClassification: orphanClassificationKey || '',
            ageFrom: ageFrom || null,
            ageTo: ageTo || null,
            dateFrom: dateFrom || '',
            dateTo: dateTo || '',
            status: statusKey || null,
            createdBy: createdBy || ''
          }),
        );
  };
  const handleRedirect = () => {
    navigate('/child/new');
  };
  const handleRedirectToEdit = (id: number) => {
    navigate(`/child/${id}/edit`);
  };
  const handleRedirectToVeiw = (id: number) => {
    navigate(`/child/${id}/child-transaction-reports`);
  };
  const sort = p => () => {
    setSortState({
      ...sortState,
      order: sortState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };
  // sponership options..
  function sponsorshipTypes() {
    const subscriptionItems: MenuProps['items'] = [
      {
        label: `  ${translate('kafalaApp.child.All')}`,
        key: '1',
        onClick() {
          setSponsorshipType(translate('kafalaApp.child.All'));
          setSponsorshipKey(null);
        },
      },
      {
        label: ` ${translate('kafalaApp.child.EDUCATIONAL')}`,
        key: '2',
        onClick() {
          setSponsorshipType(translate('kafalaApp.child.EDUCATIONAL'));
          setSponsorshipKey('EDUCATIONAL');
        },
      },
      {
        label: ` ${translate('kafalaApp.child.HEALTH')}`,
        key: '3',
        onClick() {
          setSponsorshipType(translate('kafalaApp.child.HEALTH'));
          setSponsorshipKey('HEALTH');
        },
      },
      {
        label: `${translate('kafalaApp.child.FINANCIAL')}`,
        key: '4',
        onClick() {
          setSponsorshipType(translate('kafalaApp.child.FINANCIAL'));
          setSponsorshipKey('FINANCIAL');
        },
      },
      {
        label: `${translate('kafalaApp.child.SOCIAL')}`,
        key: '5',
        onClick() {
          setSponsorshipType(translate('kafalaApp.child.SOCIAL'));
          setSponsorshipKey('SOCIAL');
        },
      },
      {
        label: `${translate('kafalaApp.child.OTHER')}`,
        key: '6',
        onClick() {
          setSponsorshipType(translate('kafalaApp.child.OTHER'));
          setSponsorshipKey('OTHER');
        },
      },
    ];
    return subscriptionItems;
  }

  //orphan classification
  function orphanClassifications() {
    const subscriptionItems: MenuProps['items'] = [
      {
        label: `  ${translate('kafalaApp.child.All')}`,
        key: '1',
        onClick() {
          setOrphanClassification(translate('kafalaApp.child.All'));
          setOrphanClassificationKey(null);
        },
      },
      {
        label: ` ${translate('kafalaApp.child.FATHER_ORPHAN')}`,
        key: '2',
        onClick() {
          setOrphanClassification(translate('kafalaApp.child.FATHER_ORPHAN'));
          setOrphanClassificationKey('FATHER_ORPHAN');
        },
      },
      {
        label: ` ${translate('kafalaApp.child.MOTHER_ORPHAN')}`,
        key: '3',
        onClick() {
          setOrphanClassification(translate('kafalaApp.child.MOTHER_ORPHAN'));
          setOrphanClassificationKey('MOTHER_ORPHAN');
        },
      },
      {
        label: `${translate('kafalaApp.child.MOTHER_AND_FATHER')}`,
        key: '4',
        onClick() {
          setOrphanClassification(translate('kafalaApp.child.MOTHER_AND_FATHER'));
          setOrphanClassificationKey('OTHER');
        },
      },
    ];
    return subscriptionItems;
  }

  //age ranges
  function ageRanges() {
    const subscriptionItems: MenuProps['items'] = [
      {
        label: `  ${translate('kafalaApp.child.All')}`,
        key: '1',
        onClick() {
          setAgeRange(translate('kafalaApp.child.All'));
          setAgeRangeKey(null);
          setAgeFrom(null);
          SetAgeTo(null);
        },
      },
      {
        label: ` ${translate('kafalaApp.child.From0To2')}`,
        key: '2',
        onClick() {
          setAgeRange(translate('kafalaApp.child.From0To2'));
          setAgeRangeKey('From0To2');
          setAgeFrom(0);
          SetAgeTo(2);
        },
      },
      {
        label: ` ${translate('kafalaApp.child.From2To4')}`,
        key: '3',
        onClick() {
          setAgeRange(translate('kafalaApp.child.From2To4'));
          setAgeRangeKey('From2To4');
          setAgeFrom(2);
          SetAgeTo(4);
        },
      },
      {
        label: `${translate('kafalaApp.child.From4To6')}`,
        key: '4',
        onClick() {
          setAgeRange(translate('kafalaApp.child.From4To6'));
          setAgeRangeKey('From4To6');
          setAgeFrom(4);
          SetAgeTo(6);
        },
      },
      {
        label: `${translate('kafalaApp.child.From6To8')}`,
        key: '5',
        onClick() {
          setAgeRange(translate('kafalaApp.child.From6To8'));
          setAgeRangeKey('From6To18');
          setAgeFrom(6);
          SetAgeTo(8);
        },
      },
      {
        label: `${translate('kafalaApp.child.From8To10')}`,
        key: '6',
        onClick() {
          setAgeRange(translate('kafalaApp.child.From8To10'));
          setAgeRangeKey('From6To18');
          setAgeFrom(8);
          SetAgeTo(10);
        },
      },
      {
        label: `${translate('kafalaApp.child.From10To12')}`,
        key: '7',
        onClick() {
          setAgeRange(translate('kafalaApp.child.From10To12'));
          setAgeRangeKey('From10To12');
          setAgeFrom(10);
          SetAgeTo(12);
        },
      },
      {
        label: `${translate('kafalaApp.child.From12To14')}`,
        key: '8',
        onClick() {
          setAgeRange(translate('kafalaApp.child.From12To14'));
          setAgeRangeKey('From12To14');
          setAgeFrom(12);
          SetAgeTo(14);
        },
      },
      {
        label: `${translate('kafalaApp.child.From14To16')}`,
        key: '9',
        onClick() {
          setAgeRange(translate('kafalaApp.child.From14To16'));
          setAgeRangeKey('From14To16');
          setAgeFrom(14);
          SetAgeTo(16);
        },
      },
      {
        label: `${translate('kafalaApp.child.From16To18')}`,
        key: '10',
        onClick() {
          setAgeRange(translate('kafalaApp.child.From16To18'));
          setAgeRangeKey('From16To18');
          setAgeFrom(6);
          SetAgeTo(18);
        },
      },
    ];
    return subscriptionItems;
  }

  // Import excel sheet

  const hasRequiredHeaders = headers => {
    const requiredHeaders = [
      'name*',
      'nationalId*',
      'fatherName*',
      'motherName*',
      'familyName*',
      'gender*',
      'description*',
      'address*',
      'age*',
      'Chronic Disease*',
      'Has Disability*',
      'Has Mental Illness*',
      'Sychological Health*',
      'Date of Death*',
      'Orphan Classfication*',
      'SponsorshipName*',
      'Sponser Connection*',
      //  'Sponsership Party*',
      'Sponsership Type*',
      'Minimum Cost*',
    ];
    const res = requiredHeaders.every(header => headers.includes(header));
    return res;
  };

  const handleImport = info => {
    if (info.file && info.file.originFileObj && info.file.status !== 'error') {
      const file = info.file.originFileObj;
      if (file) {
        const reader = new FileReader();
        reader.onload = eventReader => {
          const wb = read(eventReader.target.result);
          const sheets = wb.SheetNames;
          if (sheets.length) {
            const rows = utils.sheet_to_json<any>(wb.Sheets[sheets[0]]);
            const headers: string[] = utils.sheet_to_json(wb.Sheets[sheets[0]], { header: 1, defval: '', skipHidden: true });
            if (hasRequiredHeaders(headers[0]) == false) {
              toast.error(translate('kafalaApp.child.wrongFile'));
            } else {
              if (rows.length > 0) {
                // reduce rows to be 50 row in every bulk
                const chunkArray = rows.reduce((all, one, i) => {
                  const ch = Math.floor(i / 50);
                  all[ch] = [].concat(all[ch] || [], one);
                  return all;
                }, []);
                let progress = 0;
                for (let i = 0; i < chunkArray.length; i++) {
                  dispatch(importChilds(chunkArray[i]));
                  progress += (chunkArray[i].length / rows.length) * 100;
                }
              } else {
                toast.error(translate('eldawliaApp.unit.importEmpty'));
              }
            }
          }
        };
        reader.readAsArrayBuffer(file);
      }
    }
    setDataImported(true);
  };
  const downLoadTemplateData = () => {
    const url = '/content/files/kafala-child-template.xlsx';

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'kafala-child-template.xlsx');

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // const downLoadTemplateData = async () => {
  //   const fileName = `childs-template.xlsx`;
  //   const workbook = new ExcelJS.Workbook();
  //   const worksheet = workbook.addWorksheet('Sheet 1');
  //   worksheet.columns = [
  //     { header: `${translate('kafalaApp.child.childName')} *`, key: 'name', width: 40, style: { alignment: { horizontal: 'center' } } },
  //     {
  //       header: `${translate('kafalaApp.child.nationalId')} *`,
  //       key: 'nationalId',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: `${translate('kafalaApp.child.fatherName')} *`,
  //       key: 'fatherName',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: `${translate('kafalaApp.child.motherName')} *`,
  //       key: 'motherName',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: `${translate('kafalaApp.child.familyName')} *`,
  //       key: 'familyName',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     { header: `${translate('kafalaApp.child.gender')} *`, key: 'gender', width: 40, style: { alignment: { horizontal: 'center' } } },
  //     {
  //       header: `${translate('kafalaApp.child.description')} *`,
  //       key: 'description',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     { header: `${translate('kafalaApp.child.address')} *`, key: 'address', width: 40, style: { alignment: { horizontal: 'center' } } },
  //     { header: `${translate('kafalaApp.child.age')} *`, key: 'age', width: 40, style: { alignment: { horizontal: 'center' } } },
  //     {
  //       header: `${translate('kafalaApp.childHealthStatus.chronicDisease')} *`,
  //       key: 'chronicDisease',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: `${translate('kafalaApp.childHealthStatus.hasDisability')} *`,
  //       key: 'hasDisability',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: `${translate('kafalaApp.childHealthStatus.hasMentalIllness')}* `,
  //       key: 'hasMentalIllness',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: `${translate('kafalaApp.childHealthStatus.sychologicalHealth')} *`,
  //       key: 'sychologicalHealth',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },

  //     {
  //       header: `${translate('kafalaApp.childMaritalStatus.fatherDateOfDeath')} *`,
  //       key: 'fatherDateOfDeath',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: translate('kafalaApp.childMaritalStatus.orphanClassification'),
  //       key: 'orphanClassification',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: `${translate('kafalaApp.childSponsorShip.name')} *`,
  //       key: 'sponsorshipName',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: `${translate('kafalaApp.childSponsorShip.sponserConnection')} *`,
  //       key: 'sponserConnection',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     // {
  //     //   header: translate('kafalaApp.childSponsorShip.sponsershipParty'),
  //     //   key: 'sponsershipParty',
  //     //   width: 40,
  //     //   style: { alignment: { horizontal: 'center' } },
  //     // },
  //     {
  //       header: `${translate('kafalaApp.relSponsershipTypes.sponsershipType')} *`,
  //       key: 'sponsershipType',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: `${translate('kafalaApp.childSponsorShip.minimumCost')} *`,
  //       key: 'minimumCost',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: translate('kafalaApp.child.email'),
  //       key: 'email',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: translate('kafalaApp.child.nationalImage'),
  //       key: 'nationalImage',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: translate('kafalaApp.child.nationalImage'),
  //       key: 'nationalImage',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: translate('kafalaApp.child.birthCertificate'),
  //       key: 'birthCertificate',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: translate('kafalaApp.child.image'),
  //       key: 'image',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: translate('kafalaApp.child.vedio'),
  //       key: 'vedio',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: translate('kafalaApp.childHealthStatus.disabilityType'),
  //       key: 'disabilityType',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: translate('kafalaApp.childHealthStatus.disabilityImage'),
  //       key: 'disabilityImage',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: translate('kafalaApp.childHealthStatus.mentalIllnessType'),
  //       key: 'mentalIllnessType',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: translate('kafalaApp.childHealthStatus.mentalIllnessImage'),
  //       key: 'mentalIllnessImage',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: translate('kafalaApp.childHealthStatus.sychologicalHealthType'),
  //       key: 'sychologicalHealthType',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: translate('kafalaApp.childHealthStatus.sychologicalHealthImage'),
  //       key: 'sychologicalHealthImage',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: translate('kafalaApp.childMaritalStatus.dateOfBeathImage'),
  //       key: 'dateOfBeathImage',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: translate('kafalaApp.childMaritalStatus.numOfSibiling'),
  //       key: 'numOfSibiling',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: translate('kafalaApp.childHealthStatus.sychologicalHealthType'),
  //       key: 'sychologicalHealthType',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: translate('kafalaApp.childEducationStatus.lastLevelOfEducation'),
  //       key: 'lastLevelOfEducation',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: translate('kafalaApp.child.childNotes'),
  //       key: 'childNotes',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: translate('kafalaApp.childMaritalStatus.guardianName'),
  //       key: 'guardianName',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: translate('kafalaApp.childMaritalStatus.guardianNationalID'),
  //       key: 'guardianNationalID',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: translate('kafalaApp.childMaritalStatus.guardianRelationship'),
  //       key: 'guardianRelationship',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: translate('kafalaApp.childMaritalStatus.guardianDocument'),
  //       key: 'guardianDocument',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: translate('kafalaApp.childMaritalStatus.lostHousing'),
  //       key: 'lostHousing',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: translate('kafalaApp.childMaritalStatus.lostLimbs'),
  //       key: 'lostLimbs',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: translate('kafalaApp.childMaritalStatus.lostSight'),
  //       key: 'lostSight',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: translate('kafalaApp.childMaritalStatus.lostLimbs'),
  //       key: 'lostLimbs',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: translate('kafalaApp.childMaritalStatus.lostSight'),
  //       key: 'lostSight',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //     {
  //       header: translate('kafalaApp.childMaritalStatus.Lostabilitytohearorspeak'),
  //       key: 'Lostabilitytohearorspeak',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },

  //     {
  //       header: translate('kafalaApp.childMaritalStatus.chronicDiseases'),
  //       key: 'chronicDiseases',
  //       width: 40,
  //       style: { alignment: { horizontal: 'center' } },
  //     },
  //   ];

  //   const buffer = await workbook.xlsx.writeBuffer();
  //   const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //   saveAs(blob, fileName);
  // };
  function downloadExcel(data) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Invalid Imported Childs');
    XLSX.writeFile(wb, 'InvalidImportedChilds.xlsx');
  }

  useEffect(() => {
    if (invalidImportedChilds && invalidImportedChilds.length && dataImported) {
      downloadExcel(invalidImportedChilds);
    }
  }, [invalidImportedChilds]);

  const acceptanceType = ['.csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];

  return (
    <div>
      <div className="d-flex justify-content-between" style={{ marginTop: '30px', marginBottom: '15px' }}>
        <div>
          <h2 style={{ fontSize: '23px', fontWeight: '600' }} id="child-heading" data-cy="ChildHeading">
            <Translate contentKey="kafalaApp.child.home.title">Children</Translate>
            <p style={{ color: '#737373', fontSize: '12px', marginTop: '15px' }}>
              <Translate contentKey="kafalaApp.child.childCount">Children</Translate> :{' '}
              <span style={{ fontWeight: '500', color: '#212121' }}>{totalItems}</span>
            </p>
          </h2>
        </div>
        <div className="d-flex">
          <button className="buttonDesign" onClick={() => prepareDataToExport()} disabled={disableExportButton}>
            <Translate contentKey="kafalaApp.child.downloadReport">downloadReport</Translate>
          </button>
          <Modal
            show={show}
            backdrop="static"
            onHide={handleClose}
            keyboard={false}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header>
              <Modal.Title>
                {' '}
                <Translate contentKey="global.DownloadingReport">Export Excel</Translate>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <div style={{ display: showProgress && exportData.length > 0 ? 'block' : 'none' }}>
                <div style={{ position: 'relative', width: '100%' }}>
                  <ProgressBar
                    animated
                    variant={importProgress === 100 ? 'success' : null}
                    now={importProgress || 0}
                    style={{ height: '25px' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontWeight: 'bold',
                      color: 'black',
                    }}
                  >
                    {`${importProgress}%`}
                  </span>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          <Dropdown>
            <Dropdown.Toggle className="dots-button" id="dropdown-basic">
              <img src="../../../content/images/green-dots-vertical.png" alt="dots" />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={handleRedirect}>
                <Translate contentKey="kafalaApp.child.addChild">addChild</Translate>
              </Dropdown.Item>
              <Dropdown.Item>
                <Upload
                  customRequest={event => {
                    event.onSuccess('ok');
                  }}
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  onChange={handleImport}
                  beforeUpload={file => {
                    if (!acceptanceType.includes(file.type)) {
                      toast.error(`${translate('eldawliaApp.transaction.fileExtension')}`);
                      return false;
                    } else {
                      return true;
                    }
                  }}
                >
                  <Button icon={<UploadOutlined rev={undefined} />} className="btnUploadBulk">
                    {translate('kafalaApp.child.addChildFile')}
                  </Button>
                </Upload>
              </Dropdown.Item>
              <Dropdown.Item onClick={downLoadTemplateData}>
                <Translate contentKey="kafalaApp.child.downLoadTemplateData">downLoadTemplateData</Translate>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <div className="filter-container">
        <div className="filter-item">
          <img src="../../../content/images/searchIcon.png" alt="search icon" />
          <input
            onChange={e => {
              setName(e.target.value);
            }}
            className="search-input"
            placeholder={translate('kafalaApp.child.searchByName')}
          />
        </div>
        <div className="filter-item">
          <img src="../../../content/images/searchIcon.png" alt="search icon" />
          <input
            onChange={e => {
              setCreatedBy(e.target.value);
            }}
            className="search-input"
            placeholder={translate('kafalaApp.child.searchByCreatedBy')}
          />
        </div>
        <div className="dropdownFilter">
          <AntdDropdown
            menu={{
              items: sponsorshipTypes(),
            }}
          >
            <Button style={{ backgroundColor: 'white', borderRadius: '8px' }}>
              <Space>
                <span id="subscriptionFilter" className="filterTitle">
                  <Translate contentKey="kafalaApp.child.sponsorshipType">sponsorshipType</Translate>:
                </span>
                <span id="subscriptionFilterValue" className="text-dark">
                  : {sponsershipType}
                </span>
                <DownOutlined style={{ color: '#737373' }} />
              </Space>
            </Button>
          </AntdDropdown>
        </div>
        <div className="dropdownFilter">
          <AntdDropdown
            menu={{
              items: statusOptions(),
            }}
          >
            <Button style={{ backgroundColor: 'white', borderRadius: '8px' }}>
              <Space>
                <span id="statusFilter" className="filterTitle">
                  <Translate contentKey="kafalaApp.child.status">Status</Translate>:
                </span>
                <span className="text-dark">: {status}</span>
                <DownOutlined style={{ color: '#737373' }} />
              </Space>
            </Button>
          </AntdDropdown>
        </div>
        {showMoreFilters && (
          <div className="d-flex">
            <div className="dropdownFilter">
              <AntdDropdown
                menu={{
                  items: orphanClassifications(),
                }}
              >
                <Button style={{ backgroundColor: 'white', borderRadius: '8px' }}>
                  <Space>
                    <span id="subscriptionFilter" className="filterTitle">
                      <Translate contentKey="kafalaApp.child.orphanClassification">orphanClassifications</Translate>:
                    </span>
                    <span className="text-dark">: {orphanClassification}</span>
                    <DownOutlined style={{ color: '#737373' }} />
                  </Space>
                </Button>
              </AntdDropdown>
            </div>
            <div className="dropdownFilter">
              <AntdDropdown
                menu={{
                  items: ageRanges(),
                }}
              >
                <Button style={{ backgroundColor: 'white', borderRadius: '8px' }}>
                  <Space>
                    <span id="subscriptionFilter" className="filterTitle">
                      <Translate contentKey="kafalaApp.child.ageRange">ageRange</Translate>:
                    </span>
                    <span className="text-dark">: {ageRange}</span>
                    <DownOutlined style={{ color: '#737373' }} />
                  </Space>
                </Button>
              </AntdDropdown>
            </div>
            <Space direction="vertical" size={8}>
              <Space direction="vertical" size={8}>
                <Space direction="horizontal" size={30}>
                  <RangePicker
                    onChange={handleChangeDate}
                    allowEmpty={[true, true]}
                    format={'YYYY/MM/DD'}
                    locale={currentLocale === 'ar-ly' ? localeAr : localeEn}
                  />
                </Space>
              </Space>
            </Space>
          </div>
        )}
        {!showMoreFilters ? (
          <button className="more-filter" onClick={() => setShowMoreFilters(!showMoreFilters)}>
            <p>{translate('kafalaApp.child.more')}</p>
            <img src="../../../content/images/ic_round-add.png" alt="search icon" />
          </button>
        ) : (
          ''
        )}
      </div>
      <div className="table-responsive">
        {childList && childList.length > 0 ? (
          <Table responsive className="generalTable">
            <thead className="tableHeader">
              <tr>
                <th className="hand">
                  <Translate contentKey="kafalaApp.child.childName">child Name</Translate>
                </th>
                <th className="hand">
                  <Translate contentKey="kafalaApp.child.gender">Gender</Translate>
                </th>
                <th className="hand">
                  <Translate contentKey="kafalaApp.child.age">Age</Translate>
                </th>
                <th className="hand">
                  <Translate contentKey="kafalaApp.child.sponsershipType">SponsorshipType</Translate>
                </th>
                <th className="hand">
                  <Translate contentKey="kafalaApp.child.orphanClassification">OrphanClassification</Translate>
                </th>
                <th className="hand">
                  <Translate contentKey="kafalaApp.child.cost">Cost</Translate>
                </th>
                <th className="hand">
                  <Translate contentKey="kafalaApp.child.score">score</Translate>
                </th>
                <th className="hand">
                  <Translate contentKey="kafalaApp.child.collectedUntilNow">Collected Until Now</Translate>
                </th>
                <th className="hand">
                  <Translate contentKey="kafalaApp.child.createdBy">Created By</Translate>
                </th>
                <th className="hand">
                  <Translate contentKey="kafalaApp.child.sponsorshipName">Sponsorship Name</Translate>
                </th>
                <th className="hand" onClick={sort('status')}>
                  <Translate contentKey="kafalaApp.relChildKafeel.status">Status</Translate>{' '}
                </th>
                <th>
                  <Translate contentKey="kafalaApp.relChildKafeel.changeStatus">change status</Translate>
                </th>
                {/* <th className="hand">
                  <Translate contentKey="kafalaApp.child.psychologist">Psychologist</Translate>
                </th>
                <th className="hand">
                  <Translate contentKey="kafalaApp.child.healthSpecilaist">HealthSpecilaist</Translate>
                </th>
                <th className="hand">
                  <Translate contentKey="kafalaApp.child.socialSpecilalist">SocialSpecilalist</Translate>
                </th> */}
                <th>
                  {/* <Dropdown>
                    <Dropdown.Toggle
                      as="span"
                      id="dropdown-basic"
                      className="td-dots-button"
                      style={{ cursor: 'pointer', display: 'inline-block', backgroundColor: 'transparent', border: 'none' }}
                    >
                      <img src="../../../content/images/dots-vertical.png" alt="dots" />
                    </Dropdown.Toggle>
                  </Dropdown> */}
                </th>
              </tr>
            </thead>
            <tbody>
              {childList?.map((child, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>{child.firstName + ' ' + child.fatherName + ' ' + child.familyName}</td>
                  <td>{translate(`kafalaApp.Gender.${child.gender}`)}</td>
                  <td>{child.age}</td>
                  <td>
                    {child.childSponsorShip?.relSponsershipTypes
                      ?.map(relType => translate(`kafalaApp.child.${relType.sponsershipType.type}`))
                      .join(', ')}
                  </td>
                  <td>
                    {child?.childMaritalStatus?.orphanClassification
                      ? translate(
                          `kafalaApp.child.${child?.childMaritalStatus?.orphanClassification !== 'OTHER' ? child?.childMaritalStatus?.orphanClassification : 'MOTHER_AND_FATHER'}`,
                        )
                      : ''}
                  </td>
                  <td>{child?.childSponsorShip?.minimumCost}</td>
                  <td>{child?.score}</td>
                  <td>{child?.totalCost}</td>
                  <td>{child?.createdBy}</td>
                  <td>{child?.childSponsorShip?.name ? child?.childSponsorShip?.name : '...'}</td>
                  <td>{translate(`kafalaApp.ChildStatus.${child.status}`)}</td>
                  <td className="nowrap">
                    <Button className="btn btn-success" onClick={() => openChangeStatusModal(child)}>
                      <Translate contentKey="kafalaApp.child.changeStatus">Change Status</Translate>
                    </Button>
                  </td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle
                        as="span"
                        id="dropdown-basic"
                        className="td-dots-button"
                        style={{ cursor: 'pointer', display: 'inline-block', backgroundColor: 'transparent', border: 'none' }}
                      >
                        <img src="../../../content/images/dots-vertical.png" alt="dots" />
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleRedirectToEdit(child.id)}>
                          <Translate contentKey="kafalaApp.child.editData">Edit Data</Translate>
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleRedirectToVeiw(child.id)}>
                          <Translate contentKey="kafalaApp.child.transactionReport">transaction report</Translate>
                        </Dropdown.Item>
                        {/* <Dropdown.Item disabled>
                          <Translate contentKey="kafalaApp.child.changePassword">Change Password</Translate>
                        </Dropdown.Item>
                        <Dropdown.Item disabled>
                          <Translate contentKey="kafalaApp.child.stopAccount">Stop Account</Translate>
                        </Dropdown.Item>
                        */}
                        {child?.totalCost === 0 && (
                          <Dropdown.Item style={{ color: 'red' }} onClick={() => (window.location.href = `/child/${child.id}/delete`)}>
                            <Translate contentKey="kafalaApp.child.deleteAccount">Delete Account</Translate>
                          </Dropdown.Item>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="kafalaApp.child.home.notFound">No Children found</Translate>
            </div>
          )
        )}
      </div>
      <ChangeChildStatusModal
          child={selectedChild}
          availableStatuses={[ChildStatus.PENDING, ChildStatus.APPROVED, ChildStatus.REJECTED]}
          isOpen={isChangeStatusModalOpen}
          onSubmit={saveChildStatus}
          onCancel={closeChangeStatusModal}
          updateSuccess={updateSuccess}
          loading={loading}
          selectedStatus={selectedStatus}
        />
      <div id="clientListPagination" className={childList && childList.length > 0 ? '' : 'd-none'}>
        <Row className="justify-content-center">
          <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
        </Row>
        <Row className="justify-content-center">
          <JhiPagination
            activePage={paginationState.activePage}
            onSelect={handlePagination}
            maxButtons={5}
            itemsPerPage={paginationState.itemsPerPage}
            totalItems={totalItems}
          />
        </Row>
      </div>
    </div>
  );
};

export default Child;
