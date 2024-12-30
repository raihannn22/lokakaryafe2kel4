import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { EmpSuggestionService } from '../../service/emp-suggestion/emp-suggestion.service';
import { DropdownModule } from 'primeng/dropdown';
import Swal from 'sweetalert2';
import { InputTextareaModule } from 'primeng/inputtextarea';

interface EmpSuggestion {
  suggestion: string;
  isExisting?: boolean;
}

@Component({
  selector: 'app-emp-suggestion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    InputTextareaModule,
  ],
  templateUrl: './emp-suggestion.component.html',
  styleUrls: ['./emp-suggestion.component.css'],
})
export class EmpSuggestionComponent implements OnInit {
  empSuggestions: EmpSuggestion[] = [];
  isSaving = false;
  isExistingData = false;
  assessmentYear: number = new Date().getFullYear();

  isAddRowDisabled: boolean = false; // Menyimpan status disabled untuk tombol tambah row
  hasNewData: boolean = false; // Menyimpan status apakah ada data baru
  isFormComplete: boolean = false; // Menyimpan status apakah form lengkap

  userName: string | null = '';
  yearOptions = [
    { label: '2023', value: 2023 },
    { label: '2024', value: 2024 },
    { label: '2025', value: 2025 },
  ];

  constructor(private empSuggestionService: EmpSuggestionService) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem('full_name');
    this.fetchEmpSuggestions();
    this.onYearChange();
  }

  fetchEmpSuggestions(): void {
    const userId = localStorage.getItem('id');
    if (!userId) {
      alert('Please log in to access your data.');
      return;
    }

    this.empSuggestionService.getEmpSuggestionByUserId(userId).subscribe({
      next: (response) => {
        if (response && Array.isArray(response.content)) {
          this.empSuggestions = response.content.map(
            (item: { id: string; suggestion: string }) => ({
              id: item.id,
              suggestion: item.suggestion,
              isExisting: true,
            })
          );
        } else {
          this.empSuggestions = [{ suggestion: '', isExisting: false }];
        }
      },
      error: (error) => {
        console.error('Error fetching suggestions:', error);
        this.empSuggestions = [{ suggestion: '', isExisting: false }];
      },
    });
  }

  populateFormWithExistingData(empSuggestions: any[]): void {
    this.empSuggestions = empSuggestions.map((suggestion) => ({
      ...suggestion,
      isExisting: true,
    }));
  }

  addRow(): void {
    this.empSuggestions.push({
      suggestion: '',
      isExisting: false,
    });
    this.hasNewData = true; // Set hasNewData menjadi true saat menambahkan baris baru
    this.checkFormCompleteness(); // Periksa status form setelah menambahkan baris
  }

  checkFormCompleteness(): void {
    this.isFormComplete = this.empSuggestions.some(
      (suggestion) =>
        suggestion.suggestion && suggestion.suggestion.trim() !== ''
    );
    this.hasNewData = this.empSuggestions.some(
      (suggestion) =>
        !suggestion.isExisting &&
        suggestion.suggestion &&
        suggestion.suggestion.trim() !== ''
    );
  }

  removeRow(index: number): void {
    const suggestion = this.empSuggestions[index];
    if (!suggestion.isExisting) {
      this.empSuggestions.splice(index, 1);
    }
  }

  // isFormComplete(): boolean {
  //   return this.empSuggestions.every(
  //     (suggestion) =>
  //       suggestion.suggestion && suggestion.suggestion.trim() !== ''
  //   );
  // }

  saveAllEmpSuggestions(): void {
    const currentYear = new Date().getFullYear();
    const userId = localStorage.getItem('id');
    const dataToSave = this.empSuggestions
      .filter((suggestion) => suggestion.suggestion.trim() !== '')
      .map((suggestion) => ({
        user_id: userId,
        suggestion: suggestion.suggestion,
        assessment_year: currentYear,
      }));

    if (dataToSave.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Suggestions!',
        text: 'Tidak ada saran yang valid untuk disimpan. Harap isi setidaknya satu saran.',
      });
      return;
    }
    if (dataToSave.length > 0) {
      Swal.fire({
        html: 'Are you sure you want to save this Personal Suggestions? <br> Submitted data cannot be changed',
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, save it!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.isSaving = true;

          this.empSuggestionService
            .saveAllEmpSuggestions(dataToSave)
            .subscribe({
              next: () => {
                this.isSaving = false;

                // <<<<<<< banu
                this.onYearChange();
                this.empSuggestions.forEach((item) => {
                  if (
                    dataToSave.find(
                      (savedItem) => savedItem.suggestion === item.suggestion
                    )
                  ) {
                    item.isExisting = true;
                  }
                });
                Swal.fire({
                  icon: 'success',
                  title: 'Success!',
                  text: 'Saran berhasil disimpan!',
                });
              },
              error: (error) => {
                console.error('Terjadi kesalahan saat menyimpan saran:', error);
                Swal.fire({
                  icon: 'error',
                  title: 'Failed!',
                  text: 'Gagal menyimpan saran. Silakan periksa konsol untuk detailnya.',
                });
                this.isSaving = false;
              },
            });
        }
      });
    }
  }

  onYearChange(): void {
    const userId = localStorage.getItem('id');
    const currentYear = new Date().getFullYear(); // Ambil tahun saat ini

    // Disable tombol tambah row jika tahun yang dipilih bukan tahun saat ini
    this.isAddRowDisabled = this.assessmentYear !== currentYear;

    if (userId) {
      this.empSuggestionService
        .getEmpSuggestionByUserIdAndAssesmentYear(userId, this.assessmentYear)
        .subscribe({
          next: (response) => {
            if (response && Array.isArray(response.content)) {
              this.empSuggestions = response.content.map(
                (item: { id: string; suggestion: string }) => ({
                  id: item.id,
                  suggestion: item.suggestion,
                  isExisting: true,
                })
              );
            } else {
              this.empSuggestions = [{ suggestion: '', isExisting: false }];
            }
            this.checkFormCompleteness(); // Periksa status form setelah mengambil data
          },
          error: (error) => {
            console.error('Error fetching suggestions:', error);
            this.empSuggestions = [{ suggestion: '', isExisting: false }];
          },
        });
    }
  }
  // =======
  //   Swal.fire({
  //     html: 'Apakah Anda yakin ingin menyimpan data ini? <br> data yang di submit tidak dapat diubah',
  //     title: 'Are you sure?',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, change it!'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.empSuggestionService.saveAllEmpSuggestions(dataToSave).subscribe({
  //         next: () => {
  //           this.empSuggestions.forEach((item) => {
  //             if (dataToSave.find((savedItem) => savedItem.suggestion === item.suggestion)) {
  //               item.isExisting = true;
  //             }
  //           });
  //           this.isSaving = false;
  //           window.location.reload();
  //         },
  //         error: (error) => {
  //           console.error('Terjadi kesalahan saat menyimpan saran:', error);
  //           alert('Gagal menyimpan saran. Silakan periksa konsol untuk detailnya.');
  //           this.isSaving = false;
  //         },
  //       });
  //     }else{
  //       this.isSaving = false;
  //     }
  //   });

  // >>>>>>> main
}
