import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit {
  public rowData: any = [];
  public data: any = [];

  columnDefs: ColDef[] = [
    { field: 'name', headerName: 'Name' },
    { field: 'job', headerName: 'Job' },
    { field: 'phone_number', headerName: 'PhoneNumber' },
    { field: 'company', headerName: 'Company' },
    { field: 'account', headerName: 'Account' },
    { field: 'swift', headerName: 'Swift' },
    { field: 'balance', headerName: 'Balance' },
    { field: 'code', headerName: 'Code' },
  ];

  constructor(private service: ApiService) {}
  ngOnInit(): void {
    this.service.getData().subscribe((response) => {
      this.data = response;
      console.log('Full data', response);

      const containingXs = this.data.filter(
        (x: any) => (x.swift.match(/X/g) || []).length === 4
      );
      console.log('X contain 4', containingXs);

      const accountLessOrEqual14 = this.data.filter(
        (x: any) => x.account.length <= 14
      );
      console.log('Account less or equal 14', accountLessOrEqual14);

      const phoneNumberContainX = this.data.filter((x: any) =>
        x.phone_number.includes('x')
      );
      console.log('Phone number include x', phoneNumberContainX);

      const containEngineer = this.data.filter((x: any) =>
        x.job.includes('Engineer')
      );
      console.log('Job contain Engineer', containEngineer);

      const phoneNumberBeginWithPlus = this.data.filter((x: any) =>
        x.phone_number.startsWith('+')
      );
      console.log('Phone begin with +', phoneNumberBeginWithPlus);

      const companyContainLtd = this.data.filter((x: any) =>
        x.company.includes('Ltd')
      );
      console.log('Company Contain Ltd', companyContainLtd);

       this.rowData = phoneNumberBeginWithPlus;
    });

    //change parameter to 500 point to fetch 500
    this.service.getDataWithParameter(100).subscribe((response) => {
      console.log('100 point of Data', response);
      //this.rowData = response;
    });
  }
}
