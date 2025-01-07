import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DevplanService } from '../../../service/devplan/devplan.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-update-devplan',
  standalone: true,
  imports: [
    DialogModule,
    InputTextModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    DropdownModule,
  ],
  templateUrl: './update-devplan.component.html',
  styleUrl: './update-devplan.component.css',
})
export class UpdateDevplanComponent {
  oldDevplans: any[] = [];

  isValidForm(): boolean {
    return !!this.newDevplan.PLAN;
  }

  isUniqueDevplan(): boolean {
    if (!this.newDevplan.PLAN) return false;
    return (
      Array.isArray(this.oldDevplans) &&
      !this.oldDevplans.some(
        (devplan) =>
          devplan.PLAN.toLowerCase().trim() ===
            this.newDevplan.PLAN.toLowerCase().trim() &&
          devplan.PLAN.toLowerCase().trim() !==
            this.devplan.PLAN.toLowerCase().trim()
      )
    );
  }

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() devplan: any;
  @Output() divisionCreated = new EventEmitter<any>();

  devplans: any[] = [];

  constructor(private devplanService: DevplanService) {}

  enabledOptions = [
    { label: 'Enabled', value: 1 },
    { label: 'Disabled', value: 0 },
  ];

  ngOnInit() {
    this.devplanService.getAllDevplans().subscribe({
      next: (response) => {
        this.oldDevplans = response.content;
      },
      error: (error) => {},
    });
  }

  ngOnChanges() {
    if (this.devplan) {
      this.newDevplan = { ...this.devplan };
    }
  }

  newDevplan = {
    PLAN: '',
    ENABLED: 0,
  };

  closeDialog() {
    this.visibleChange.emit(false);
  }

  onSubmit() {
    const updatedData: any = { ...this.newDevplan };
    this.devplanService.updateDevPlan(this.devplan.ID, updatedData).subscribe({
      next: (response) => {
        this.divisionCreated.emit(response);
        this.closeDialog();
      },
      error: (error) => {},
    });
  }
}
