import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ColDef, GridOptions } from 'ag-grid-community';
import { Solution } from '../../models/index';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit {
  public rowData: any = [];
  public data: any = [];
  solutions: Solution[] = [];
  selectedSolution: Solution = {};
  public gridApi:any;
  public gridColumnApi:any;

  columnDefs: ColDef[] = [
    { field: 'name', headerName: 'Name' },
    { field: 'job', headerName: 'Job' },
    { field: 'phone_number', headerName: 'PhoneNumber',
    cellRenderer: (params:any) =>{
      return (params?.value?.startsWith('+'))?
      ('<span><i class="pi pi-phone" style="font-size: 1rem;  color: green; margin-right: 2px"></i>' + params.value + '</span>'):
       params.value}

  } ,
    { field: 'company', headerName: 'Company' },
    { field: 'account', headerName: 'Account',
    cellRenderer: function(params:any) {
        return( params?.data?.account.length <= 14)?
        ('<span><i class="pi pi-calendar-times" style="font-size: 1rem; color: red; margin-right: 2px"></i>' + params.value + '</span>'):
         params.value
        }
    },

    { field: 'swift', headerName: 'Swift',
    cellRenderer: (params:any) =>{
        return ((params?.value?.match(/X/g) || []).length === 4)?
        ('<span><i class="pi pi-check" style="font-size: 1rem;  color: green; margin-right: 2px"></i>' + params.value + '</span>'):
         params.value}
       },
    { field: 'balance', headerName: 'Balance',  cellStyle: params => {
      const removeSymbol = parseFloat(params.value.slice(1).replace(/,/g, ''));
          console.log(removeSymbol > 1000)
      if (removeSymbol > 1000) {
          //mark police cells as red
          return {color: 'green', backgroundColor: '', fontWeight: 'bold'};
      }
      else {
        return {color: 'red', backgroundColor: '',  fontWeight: 'bold'};
      }
      }},


    { field: 'code', headerName: 'Code' },
  ];

   gridOptions:GridOptions ={
    pagination: true,
  rowClassRules:  {
    'engineer-row': function(params) { return params.data.job.includes('Engineer')},
  },

  }

  onGridReady(params:any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  onRowDataChanged(){
    this.gridColumnApi.autoSizeColumns()
  }

  constructor(private service: ApiService) {
    this.solutions = [
      { identifier: 'Full Data', value: 'full' },
      { identifier: ' Swift Contain 4 Xs', value: 'containX' },
      { identifier: ' Account Less than or Equal to 14', value: 'digit' },
      { identifier: 'Phone Number contain X', value: 'phoneX' },
      { identifier: 'Job Contain Engineer', value: 'engineer' },
      { identifier: 'Phone Begin With +', value: 'phonePlus' },
      { identifier: 'Company Contain Ltd', value: 'ltd' },
      { identifier: '100 Data point', value: 'dataPoint' },
      { identifier: '500 Data point', value: 'dataPointFiveHundred' },
    ];
  }
  ngOnInit(): void {
    this.service.getData().subscribe((response) => {
      this.data = response;
      // console.log('Full data', response);
      if (this.data.length > 0) {
        this.selectedSolution = this.solutions[0];
        this.rowData = this.data;
      }
    });
  }

  filterData(value: string) {
    if (this.data.length > 0) {
      console.log('event value', value);
      switch (value) {
        case 'full': {
          this.rowData = this.data;
          console.log('Full data', this.data);
          break;
        }
        case 'containX': {
          const containingXs = this.data.filter(
            (x: any) => (x.swift.match(/X/g) || []).length === 4
          );
          console.log('X contain 4', containingXs);
          this.rowData = containingXs;
          break;
        }
        case 'digit': {
          const accountLessOrEqual14 = this.data.filter(
            (x: any) => x.account.length <= 14
          );
          console.log('Account less or equal 14', accountLessOrEqual14);
          this.rowData = accountLessOrEqual14;
          break;
        }
        case 'phoneX': {
          const phoneNumberContainX = this.data.filter((x: any) =>
            x.phone_number.includes('x')
          );
          console.log('Phone number include x', phoneNumberContainX);
          this.rowData = phoneNumberContainX;
          break;
        }
        case 'engineer': {
          const containEngineer = this.data.filter((x: any) =>
            x.job.includes('Engineer')
          );
          console.log('Job contain Engineer', containEngineer);
          this.rowData = containEngineer;
          break;
        }
        case 'phonePlus': {
          const phoneNumberBeginWithPlus = this.data.filter((x: any) =>
            x.phone_number.startsWith('+')
          );
          console.log('Phone begin with +', phoneNumberBeginWithPlus);
          this.rowData = phoneNumberBeginWithPlus;
          break;
        }
        case 'ltd': {
          const companyContainLtd = this.data.filter((x: any) =>
            x.company.includes('Ltd')
          );
          console.log('Company Contain Ltd', companyContainLtd);
          this.rowData = companyContainLtd;
          break;
        }
        case 'dataPoint': {
          this.service.getDataWithParameter(100).subscribe((response) => {
            console.log('100 point of Data', response);
            this.rowData = response;
          });
          break;
        }

        default: {
          this.service.getDataWithParameter(500).subscribe((response) => {
            console.log('500 point of Data', response);
            this.rowData = response;
          });
          break;
        }
      }
    }
  }
}
