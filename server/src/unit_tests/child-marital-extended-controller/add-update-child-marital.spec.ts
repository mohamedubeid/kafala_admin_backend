import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from '../../service/notes.service';
import { ChildMaritalNotesService } from '../../service/child-marital-notes.service';
import { ChildMaritalStatusDTO } from '../../service/dto/child-marital-status.dto';
import { Request } from '../../client/request';
import { ChildMaritalStatusExtendedController } from '../../web/rest/child-marital-status.extend.controller';
import { ChildMaritalStatusExtendedService } from '../../service/child-marital-status.extend.service';

describe('ChildMaritalStatusExtendedController', () => {
  let controller: ChildMaritalStatusExtendedController;
  let childMaritalStatusExtendedService: ChildMaritalStatusExtendedService;
  let notesService: NotesService;
  let childMaritalNotesService: ChildMaritalNotesService;

  const mockChildMaritalStatusExtendedService = {
    findByFields: jest.fn(),
    save: jest.fn(),
  };

  const mockNotesService = {
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockChildMaritalNotesService = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChildMaritalStatusExtendedController],
      providers: [
        { provide: ChildMaritalStatusExtendedService, useValue: mockChildMaritalStatusExtendedService },
        { provide: NotesService, useValue: mockNotesService },
        { provide: ChildMaritalNotesService, useValue: mockChildMaritalNotesService },
      ],
    }).compile();

    controller = module.get<ChildMaritalStatusExtendedController>(ChildMaritalStatusExtendedController);
    childMaritalStatusExtendedService = module.get<ChildMaritalStatusExtendedService>(ChildMaritalStatusExtendedService);
    notesService = module.get<NotesService>(NotesService);
    childMaritalNotesService = module.get<ChildMaritalNotesService>(ChildMaritalNotesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addUpdateChildMirtalStatus', () => {
    it('should create a new child marital status if not exists', async () => {
      const req = { user: { login: 'testUser' } } as Request;
      const childMaritalStatusDTO: ChildMaritalStatusDTO = {
        child: { id: 1 },
        childMaritalNotes: [{ notes: { id: null, content: 'Test note' } }],
      } as any;

      mockChildMaritalStatusExtendedService.findByFields.mockResolvedValue(null);
      mockChildMaritalStatusExtendedService.save.mockResolvedValue(childMaritalStatusDTO);
      mockNotesService.save.mockResolvedValue(childMaritalStatusDTO.childMaritalNotes[0].notes);

      const result = await controller.addUpdateChildMirtalStatus(req, childMaritalStatusDTO);

      expect(result).toEqual(childMaritalStatusDTO);
      expect(mockChildMaritalStatusExtendedService.findByFields).toHaveBeenCalledWith({
        where: { child: childMaritalStatusDTO.child },
        relations: ['childMaritalNotes'],
      });
      expect(mockChildMaritalStatusExtendedService.save).toHaveBeenCalled();
      expect(mockNotesService.save).toHaveBeenCalled();
    });

    it('should update existing child marital status if exists', async () => {
      const req = { user: { login: 'testUser' } } as Request;
      const existingChildMaritalStatus = {
        id: 1,
        child: { id: 1 },
        childMaritalNotes: [{ notes: { id: 1, content: 'Existing note' } }],
      };
      const childMaritalStatusDTO: ChildMaritalStatusDTO = {
        child: { id: 1 },
        childMaritalNotes: [{ notes: { id: 1, content: 'Updated note' } }],
      } as any;

      mockChildMaritalStatusExtendedService.findByFields.mockResolvedValue(existingChildMaritalStatus);
      mockChildMaritalStatusExtendedService.save.mockResolvedValue(childMaritalStatusDTO);
      mockNotesService.update.mockResolvedValue(childMaritalStatusDTO.childMaritalNotes[0].notes);

      const result = await controller.addUpdateChildMirtalStatus(req, childMaritalStatusDTO);

      expect(result).toEqual(childMaritalStatusDTO);
      expect(mockChildMaritalStatusExtendedService.findByFields).toHaveBeenCalledWith({
        where: { child: childMaritalStatusDTO.child },
        relations: ['childMaritalNotes'],
      });
      expect(mockChildMaritalStatusExtendedService.save).toHaveBeenCalled();
      expect(mockNotesService.update).toHaveBeenCalled();
    });
  });
});
