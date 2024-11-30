import { Team } from '@/lib/types/team';
import { DatabaseTransactionService } from './DatabaseTransactionService';

export class TeamService {
  constructor(private transactionService: DatabaseTransactionService) {}

  async getAllTeams(): Promise<Team[]> {
    return this.transactionService.performTransaction('teams', 'readonly', store => store.getAll());
  }
}