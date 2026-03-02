import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAnchor, MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ManagementService } from '../../services/management-service';

@Component({
  selector: 'app-create-building-page',
  imports: [MatFormFieldModule, ReactiveFormsModule, MatAnchor, MatInputModule, MatButtonModule],
  templateUrl: './create-building-page.html',
  styleUrl: './create-building-page.scss',
})
export class CreateBuildingPage {
  private readonly mgmtService = inject(ManagementService);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);

  readonly nameControl = new FormControl('', { validators: [Validators.required], nonNullable: true });
  readonly priceControl = new FormControl(0, { validators: [Validators.required, Validators.min(15)], nonNullable: true });
  readonly descControl = new FormControl('', { validators: [Validators.required], nonNullable: true });
  readonly incomeControl = new FormControl(0, { validators: [Validators.required, Validators.max(500), Validators.min(1)], nonNullable: true });
  readonly imageUrlControl = new FormControl('', { nonNullable: true });

  protected readonly buildingForm = this.formBuilder.group({
    name: this.nameControl,
    price: this.priceControl,
    description: this.descControl,
    income: this.incomeControl,
    imageUrl: this.imageUrlControl,
  });

  public onSubmit(): void {
    if (!this.buildingForm.valid) {
      alert('The form is invalid!');
      return;
    }
    this.mgmtService.createBuilding(this.buildingForm.value);
  }
}
