import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Building } from '../components/building-component/building-component';
import { ManagementService } from '../services/management-service';

export const canCreateGuard: CanActivateFn = (route, state) => {
  const mgmtService = inject(ManagementService);
  const router = inject(Router);
  let totalBuildings = 0;
  mgmtService.getBuildings().forEach((building: Building) => {
    totalBuildings += building.amountPurchased;
  })
  if(totalBuildings < 2) {
    alert('You need at least 2 buildings to be able to create a new one!');
    router.navigateByUrl('home');
    return false;
  }
  return true;
};
