import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from '../../service/notes.service';
import { ChildHealthNotesService } from '../../service/child-health-notes.service';
import { ChildHealthStatusDTO } from '../../service/dto/child-health-status.dto';
import { Request } from '../../client/request';
import { ChildHealthStatusExtendedService } from '../../service/child-health-status.extend.service';
import { ChildHealthStatusExtendedController } from '../../web/rest/child-health-status.extend.controller';

describe('ChildHealthStatusExtendedController', () => {
  let controller: ChildHealthStatusExtendedController;
  let childHealthStatusExtendedService: ChildHealthStatusExtendedService;
  let notesService: NotesService;
  let childHealthNotesService: ChildHealthNotesService;

  const mockChildHealthStatusExtendedService = {
    findByFields: jest.fn(),
    save: jest.fn(),
  };

  const mockNotesService = {
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockChildHealthNotesService = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChildHealthStatusExtendedController],
      providers: [
        { provide: ChildHealthStatusExtendedService, useValue: mockChildHealthStatusExtendedService },
        { provide: NotesService, useValue: mockNotesService },
        { provide: ChildHealthNotesService, useValue: mockChildHealthNotesService },
      ],
    }).compile();

    controller = module.get<ChildHealthStatusExtendedController>(ChildHealthStatusExtendedController);
    childHealthStatusExtendedService = module.get<ChildHealthStatusExtendedService>(ChildHealthStatusExtendedService);
    notesService = module.get<NotesService>(NotesService);
    childHealthNotesService = module.get<ChildHealthNotesService>(ChildHealthNotesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addUpdateChildHealthStatus', () => {
    it('should create a new child health status if not exists', async () => {
      const req = { user: { login: 'testUser' } } as Request;
      const childHealthStatusDTO: ChildHealthStatusDTO = {
        child: { id: 1 },
        childHealthNotes: [{ notes: { id: null, content: 'Test note' } }],
      } as any;

      mockChildHealthStatusExtendedService.findByFields.mockResolvedValue(null);
      mockChildHealthStatusExtendedService.save.mockResolvedValue(childHealthStatusDTO);
      mockNotesService.save.mockResolvedValue(childHealthStatusDTO.childHealthNotes[0].notes);

      const result = await controller.addUpdateChildHealthStatus(req, childHealthStatusDTO);

      expect(result).toEqual(childHealthStatusDTO);
      expect(mockChildHealthStatusExtendedService.findByFields).toHaveBeenCalledWith({
        where: { child: childHealthStatusDTO.child },
        relations: ['childHealthNotes'],
      });
      expect(mockChildHealthStatusExtendedService.save).toHaveBeenCalled();
      expect(mockNotesService.save).toHaveBeenCalled();
    });

    it('should update existing child health status if exists', async () => {
      const req = { user: { login: 'testUser' } } as Request;
      const existingChildHealthStatus = {
        id: 1,
        child: { id: 1 },
        childHealthNotes: [{ notes: { id: 1, content: 'Existing note' } }],
      };
      const childHealthStatusDTO: ChildHealthStatusDTO = {
        child: { id: 1 },
        childHealthNotes: [{ notes: { id: 1, content: 'Updated note' } }],
      } as any;

      mockChildHealthStatusExtendedService.findByFields.mockResolvedValue(existingChildHealthStatus);
      mockChildHealthStatusExtendedService.save.mockResolvedValue(childHealthStatusDTO);
      mockNotesService.update.mockResolvedValue(childHealthStatusDTO.childHealthNotes[0].notes);

      const result = await controller.addUpdateChildHealthStatus(req, childHealthStatusDTO);

      expect(result).toEqual(childHealthStatusDTO);
      expect(mockChildHealthStatusExtendedService.findByFields).toHaveBeenCalledWith({
        where: { child: childHealthStatusDTO.child },
        relations: ['childHealthNotes'],
      });
      expect(mockChildHealthStatusExtendedService.save).toHaveBeenCalled();
      expect(mockNotesService.update).toHaveBeenCalled();
    });
  });
});
