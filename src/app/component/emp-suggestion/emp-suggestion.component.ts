import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { EmpSuggestionService } from '../../service/emp-suggestion/emp-suggestion.service';

interface EmpSuggestion {
  suggestion: string;
  isExisting?: boolean; // Properti untuk menandai data lama
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
  ],
  templateUrl: './emp-suggestion.component.html',
  styleUrls: ['./emp-suggestion.component.css'],
})
export class EmpSuggestionComponent implements OnInit {
  empSuggestions: EmpSuggestion[] = [];
  isSaving = false;
  isExistingData = false;

  constructor(private empSuggestionService: EmpSuggestionService) {}

  ngOnInit(): void {
    this.fetchEmpSuggestions();
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
          this.empSuggestions = response.content.map((item: { id: string; suggestion: string }) => ({
          id: item.id,
          suggestion: item.suggestion,
          isExisting: true, // Mark as existing
        }));

        } else {
          // Initialize with one empty row if no existing data
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
        isExisting: true, // Tandai sebagai data lama
    }));
  }

  addRow(): void {
      this.empSuggestions.push({
          suggestion: '',
          isExisting: false, // Tandai sebagai data baru
      });
  }

  removeRow(index: number): void {
    const suggestion = this.empSuggestions[index];
    if (!suggestion.isExisting) {
      this.empSuggestions.splice(index, 1); // Hapus data baru
    }
  }

  isFormComplete(): boolean {
    return this.empSuggestions.every(
      (suggestion) =>
        suggestion.suggestion && suggestion.suggestion.trim() !== ''
    );
  }

  saveAllEmpSuggestions(): void {
  const userId = localStorage.getItem('id');
  const currentYear = new Date().getFullYear();

  // Persiapkan data untuk disimpan
  const dataToSave = this.empSuggestions
    .filter((suggestion) => suggestion.suggestion.trim() !== '') // Filter saran yang tidak kosong
    .map((suggestion) => ({
      user_id: userId,
      suggestion: suggestion.suggestion,
      assessment_year: currentYear,
    }));

  if (dataToSave.length === 0) {
    alert('Tidak ada saran yang valid untuk disimpan. Harap isi setidaknya satu saran.');
    return;
  }

  this.isSaving = true;

  this.empSuggestionService.saveAllEmpSuggestions(dataToSave).subscribe({
    next: () => {
      alert('Saran berhasil disimpan!');
      // Tandai semua data baru sebagai "existing"
      this.empSuggestions.forEach((item) => {
        if (dataToSave.find((savedItem) => savedItem.suggestion === item.suggestion)) {
          item.isExisting = true;
        }
      });
      this.isSaving = false;
    },
    error: (error) => {
      console.error('Terjadi kesalahan saat menyimpan saran:', error);
      alert('Gagal menyimpan saran. Silakan periksa konsol untuk detailnya.');
      this.isSaving = false;
    },
  });
}


}
