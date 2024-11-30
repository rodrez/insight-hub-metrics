import { DatabaseTransactionService } from '../DatabaseTransactionService';
import { DatabaseConnectionService } from '../DatabaseConnectionService';
import { Team } from '@/lib/types/team';
import { TeamService } from '../TeamService';

export class BaseIndexedDBService {
  protected connectionService: DatabaseConnectionService;
  protected transactionService: DatabaseTransactionService;
  protected teamService: TeamService;

  constructor() {
    this.connectionService = new DatabaseConnectionService();
    this.transactionService = new DatabaseTransactionService(null);
  }

  protected async initializeServices(): Promise<void> {
    await this.connectionService.init();
    this.transactionService = new DatabaseTransactionService(this.connectionService.getDatabase());
    this.teamService = new TeamService(this.transactionService);
  }
}