import React, { useCallback, useMemo, useEffect, useState } from "react";
import { SearchForm, Table, Card, Loader } from "@egovernments/digit-ui-react-components";
import { useForm, Controller, useWatch } from "react-hook-form";
import SearchReportFields from "./SearchReportFields";
// import { useParams } from "react-router-dom";

function SearchReport({ tenantId, t, moduleCode, language, onSearch, ...props }) {
  // const store = Digit.Services.useStore({ stateCode, moduleCode, language })
  // console.log("data from store data")
  // console.log(store)

  const initialValues = Digit.SessionStorage.get("SEARCH_APPLICATION_DETAIL")
    ? {
        ...Digit.SessionStorage.get("SEARCH_APPLICATION_DETAIL"),
        offset: 0,
        limit: 10,
        sortBy: "commencementDate",
        sortOrder: "DESC",
        fromDate: null,
        toDate: null,
      }
    : {
        offset: 0,
        limit: 10,
        sortBy: "commencementDate",
        sortOrder: "DESC",
        fromDate: null,
        toDate: null,
      };

  const [ReportsData, setReportsData] = useState(null);

  const { register, control, handleSubmit, setValue, getValues, reset } = useForm({
    defaultValues: initialValues,
  });
  const fromDate = useWatch({ control, name: "fromDate" });
  const toDate = useWatch({ control, name: "toDate" });

  let moduleName = "rainmaker-tl";
  let reportName = "TradeLicenseDailyCollectionReport";

  const filter = [
    {
      name: "fromDate",
      //input: fromDate,
      input: Digit.Utils.pt.convertDateToEpoch(fromDate),
    },
    {
      name: "toDate",
      // input: toDate,
      input: Digit.Utils.pt.convertDateToEpoch(toDate),
    },
  ];

  // const { isLoading: SearchFormIsLoading, data: SearchFormUIData } = Digit.Hooks.reports.useReportMeta.fetchMetaData(moduleName, reportName, "pb.amritsar")
  const { isLoading: SearchFormIsLoading, data: SearchFormUIData } = Digit.Hooks.reports.useReportMeta.fetchMetaData(
    moduleName,
    reportName,
    tenantId
  );
  console.log("searchFormUIData", SearchFormUIData);

  const { isLoading: isLoadingReportsData, data: ReportsDatas } = Digit.Hooks.reports.useReportMeta.fetchReportData(
    moduleName,
    reportName,
    tenantId,
    filter
  );
  const fetchData = () => {
    try {
      // Set loading state while fetching data
      if (isLoadingReportsData) {
        setReportsData(null);
      }
      // Update state with fetched data
      setReportsData(ReportsDatas);
      console.log("data fetched from API-->", ReportsDatas);
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleClick = () => {
    fetchData();
  };

  // const { isLoading: isLoadingReportsData, data: ReportsData } = Digit.Hooks.reports.useReportMeta.fetchReportData(
  //   moduleName,
  //   reportName,
  //   tenantId,
  //   filter
  // );
  // filter,
  // {
  //   //enabled: !!filter.length > 0
  //   enabled: true,
  // }

  //console.log("formuidata: ", SearchFormUIData);

  //console.log("reportdata:  ", ReportsData);

  const onSort = useCallback((args) => {
    if (args.length === 0) return;
    setValue("sortBy", args.id);
    setValue("sortOrder", args.desc ? "DESC" : "ASC");
  }, []);

  function onPageSizeChange(e) {
    setValue("limit", Number(e.target.value));
    // handleSubmit(onSubmit)();
    handleSubmit();
  }

  function nextPage() {
    setValue("offset", getValues("offset") + getValues("limit"));
    // handleSubmit(onSubmit)();
    handleSubmit();
  }
  function previousPage() {
    setValue("offset", getValues("offset") - getValues("limit"));
    //handleSubmit(onSubmit)();
    handleSubmit();
  }

  //   const isMobile = window.Digit.Utils.browser.isMobile();

  //   if (isMobile) {
  //     return <MobileSearchApplication {...{ Controller, register, control, t, reset, previousPage, handleSubmit, tenantId, data, onSubmit }}/>
  //   }

  // const GetCell = (value) => <span className="cell-text">{value}</span>;
  const columns = useMemo(
    () => [
      // {
      //   "name": "id",
      //   "label": "reports.hrms.id",
      //   "type": "string",
      //   "source": "eg_hrms_employee"
      // }
    ],
    []
  );

  return (
    <div>
      <SearchForm handleSubmit={handleSubmit}>
        <SearchReportFields {...{ register, handleSubmit, control, reset, tenantId, t, handleClick }} />
      </SearchForm>

      {/* {ReportsData?.display ? (
        <Card style={{ marginTop: 20 }}>
          {t(ReportsData.display)
            .split("\\n")
            .map((text, index) => (
              <p key={index} style={{ textAlign: "center" }}>
                {text}
              </p>
            ))}
        </Card>
      ) : (
        ReportsData !== "" && (
          <Table
            t={t}
            data={ReportsData}
            totalRecords={props.count}
            columns={columns}
            getCellProps={(cellInfo) => {
              return {
                style: {
                  minWidth: cellInfo.column.Header === t("ES_INBOX_APPLICATION_NO") ? "240px" : "",
                  padding: "20px 18px",
                  fontSize: "16px",
                },
              };
            }}
            onPageSizeChange={onPageSizeChange}
            currentPage={getValues("offset") / getValues("limit")}
            onNextPage={nextPage}
            onPrevPage={previousPage}
            pageSizeLimit={getValues("limit")}
            onSort={onSort}
            disableSort={false}
            sortParams={[{ id: getValues("sortBy"), desc: getValues("sortOrder") === "DESC" ? true : false }]}
          />
        )
      )} */}

      {ReportsData && ReportsData.reportData.length > 0 && (
        <Table
          t={t}
          //data={ReportsData.reportData}
          // data={ReportsData.reportData.map((rowData) =>
          //   ReportsData.reportHeader.reduce((rowObject, column, columnIndex) => {
          //     rowObject[`col${columnIndex}`] = rowData[columnIndex];
          //     return rowObject;
          //   }, {})
          // )}
          data={ReportsData.reportData.map((rowData, index) => ({
            SNo: index + 1, // Serial number starts from 1
            ...ReportsData.reportHeader.reduce((rowObject, column, columnIndex) => {
              rowObject[`col${columnIndex}`] = rowData[columnIndex];
              return rowObject;
            }, {}),
          }))}
          totalRecords={props.count}
          // columns={ReportsData.reportHeader.map((column, index) => ({
          //   Header: t(column.label),
          //   accessor: `col${index}`,
          // }))}
          columns={[
            // New SNo column
            {
              Header: "SNo.",
              accessor: "SNo",
            },
            // Dynamic columns (fetched from API data)
            ...ReportsData.reportHeader.map((column, index) => ({
              Header: t(column.label),
              accessor: `col${index}`,
            })),
          ]}
          getCellProps={(cellInfo) => {
            return {
              style: {
                minWidth: cellInfo.column.Header === t("ES_INBOX_APPLICATION_NO") ? "240px" : "",
                padding: "20px 18px",
                fontSize: "16px",
              },
            };
          }}
          onPageSizeChange={onPageSizeChange}
          currentPage={getValues("offset") / getValues("limit")}
          onNextPage={nextPage}
          onPrevPage={previousPage}
          pageSizeLimit={getValues("limit")}
          onSort={onSort}
          disableSort={false}
          sortParams={[{ id: getValues("sortBy"), desc: getValues("sortOrder") === "DESC" ? true : false }]}
        />
      )}
    </div>
  );
}
export default SearchReport;
