import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DivisiService } from '../../../service/divisi/divisi.service';
@Component({
  selector: 'app-update-division',
  standalone: true,
  imports: [
    DialogModule,
    InputTextModule,
    ButtonModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './update-division.component.html',
  styleUrl: './update-division.component.css',
})
export class UpdateDivisionComponent {
  isValidForm2(): boolean {
    const isNotEmpty = !!this.newDivision.DIVISION_NAME;

    const isUnique =
      Array.isArray(this.oldDivisions) &&
      !this.oldDivisions.some(
        (role) =>
          role.DIVISION_NAME.toLowerCase() ===
          this.newDivision.DIVISION_NAME.toLowerCase()
      );

    return isNotEmpty && isUnique;
  }

  isValidForm(): boolean {
    if (!this.newDivision.DIVISION_NAME) return false;
    return (
      Array.isArray(this.oldDivisions) &&
      !this.oldDivisions.some(
        (devplan) =>
          devplan.DIVISION_NAME.toLowerCase().trim() ===
            this.newDivision.DIVISION_NAME.toLowerCase().trim() &&
          devplan.DIVISION_NAME.toLowerCase().trim() !==
            this.division.DIVISION_NAME.toLowerCase().trim()
      )
    );
  }

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() division: any;
  @Output() divisionCreated = new EventEmitter<any>();

  oldDivisions: any[] = [];

  constructor(private divisionService: DivisiService) {}

  ngOnInit() {
    this.divisionService.getAllDivisions().subscribe({
      next: (response) => {
        this.oldDivisions = response.content;
      },
      error: (error) => {},
    });
  }

  ngOnChanges() {
    if (this.division) {
      this.newDivision = { ...this.division };
    }
  }

  newDivision = {
    DIVISION_NAME: '',
  };

  closeDialog() {
    this.visibleChange.emit(false);
  }

  onSubmit() {
    const updatedData: any = { ...this.newDivision };
    this.divisionService
      .updateDivision(this.division.ID, updatedData)
      .subscribe({
        next: (response) => {
          this.divisionCreated.emit(response);
          this.closeDialog();
        },
        error: (error) => {},
      });
  }
}
