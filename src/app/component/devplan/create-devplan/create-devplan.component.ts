import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DevplanService } from '../../../service/devplan/devplan.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-create-devplan',
  standalone: true,
  imports: [
    DialogModule,
    InputTextModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    DropdownModule,
  ],
  templateUrl: './create-devplan.component.html',
  styleUrl: './create-devplan.component.css',
})
export class CreateDevplanComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() devplanCreated = new EventEmitter<any>();

  oldDevplans: any[] = [];

  constructor(private devplanService: DevplanService) {}

  isValidForm(): boolean {
    return !!this.newDevplan.PLAN;
  }

  isValidForm2(): boolean {
    const isNotEmpty = !!this.newDevplan.PLAN;

    const isUnique =
      Array.isArray(this.oldDevplans) &&
      !this.oldDevplans.some(
        (devplan) =>
          devplan.PLAN.toLowerCase().trim() ===
          this.newDevplan.PLAN.toLowerCase().trim()
      );

    return isNotEmpty && isUnique;
  }

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

  newDevplan = {
    PLAN: '',
    ENABLED: 0,
  };

  closeDialog() {
    this.visibleChange.emit(false);
  }

  onSubmit() {
    this.devplanService.saveDevPlan(this.newDevplan).subscribe({
      next: (response) => {
        this.devplanCreated.emit(response);
        this.closeDialog();
      },
      error: (error) => {},
    });
  }
}
