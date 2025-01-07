import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DivisiService } from '../../../service/divisi/divisi.service';

@Component({
  selector: 'app-create-division',
  standalone: true,
  imports: [
    DialogModule,
    InputTextModule,
    ButtonModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './create-division.component.html',
  styleUrl: './create-division.component.css',
})
export class CreateDivisionComponent {
  isValidForm(): boolean {
    const isNotEmpty = !!this.newDivision.DIVISION_NAME;

    const isUnique =
      Array.isArray(this.oldDivisions) &&
      !this.oldDivisions.some(
        (role) =>
          role.DIVISION_NAME.toLowerCase().trim() ===
          this.newDivision.DIVISION_NAME.toLowerCase().trim()
      );

    return isNotEmpty && isUnique;
  }

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Output() divisionCreated = new EventEmitter<any>();

  divisions: any[] = [];
  roles: any[] = [];
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

  newDivision = {
    DIVISION_NAME: '',
  };

  closeDialog() {
    this.visibleChange.emit(false);
  }

  onSubmit() {
    this.divisionService.saveDivision(this.newDivision).subscribe({
      next: (response) => {
        this.divisionCreated.emit(response);
        this.closeDialog();
      },
      error: (error) => {},
    });
  }
}
