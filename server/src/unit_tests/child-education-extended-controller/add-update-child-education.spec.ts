import { Test, TestingModule } from '@nestjs/testing';

import { NotesService } from '../../service/notes.service';
import { ChildEducationNotesService } from '../../service/child-education-notes.service';
import { ChildEducationStatusDTO } from '../../service/dto/child-education-status.dto';
import { Request } from '../../client/request';
import { ChildEducationStatusExtendedController } from '../../web/rest/child-education-status.extend.controller';
import { ChildEducationStatusExtendedService } from '../../service/child-education-status.extend.service';

describe('ChildEducationStatusExtendedController', () => {
  let controller: ChildEducationStatusExtendedController;
  let childEducationStatusExtendedService: ChildEducationStatusExtendedService;
  let notesService: NotesService;
  let childEducationNotesService: ChildEducationNotesService;

  const mockChildEducationStatusExtendedService = {
    findByFields: jest.fn(),
    save: jest.fn(),
  };

  const mockNotesService = {
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockChildEducationNotesService = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChildEducationStatusExtendedController],
      providers: [
        { provide: ChildEducationStatusExtendedService, useValue: mockChildEducationStatusExtendedService },
        { provide: NotesService, useValue: mockNotesService },
        { provide: ChildEducationNotesService, useValue: mockChildEducationNotesService },
      ],
    }).compile();

    controller = module.get<ChildEducationStatusExtendedController>(ChildEducationStatusExtendedController);
    childEducationStatusExtendedService = module.get<ChildEducationStatusExtendedService>(ChildEducationStatusExtendedService);
    notesService = module.get<NotesService>(NotesService);
    childEducationNotesService = module.get<ChildEducationNotesService>(ChildEducationNotesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addUpdateChildEducationStatus', () => {
    it('should create a new child education status if not exists', async () => {
      const req = { user: { login: 'testUser' } } as Request;
      const childEducationStatusDTO: ChildEducationStatusDTO = {
        child: { id: 1 },
        childEducationNotes: [{ notes: { id: null, content: 'Test note' } }],
      } as any;

      mockChildEducationStatusExtendedService.findByFields.mockResolvedValue(null);
      mockChildEducationStatusExtendedService.save.mockResolvedValue(childEducationStatusDTO);
      mockNotesService.save.mockResolvedValue(childEducationStatusDTO.childEducationNotes[0].notes);

      const result = await controller.addUpdateChildEducationStatus(req, childEducationStatusDTO);

      expect(result).toEqual(childEducationStatusDTO);
      expect(mockChildEducationStatusExtendedService.findByFields).toHaveBeenCalledWith({
        where: { child: childEducationStatusDTO.child },
        relations: ['childEducationNotes'],
      });
      expect(mockChildEducationStatusExtendedService.save).toHaveBeenCalled();
      expect(mockNotesService.save).toHaveBeenCalled();
    });

    it('should update existing child education status if exists', async () => {
      const req = { user: { login: 'testUser' } } as Request;
      const existingChildEducationStatus = {
        id: 1,
        child: { id: 1 },
        childEducationNotes: [{ notes: { id: 1, content: 'Existing note' } }],
      };
      const childEducationStatusDTO: ChildEducationStatusDTO = {
        child: { id: 1 },
        childEducationNotes: [{ notes: { id: 1, content: 'Updated note' } }],
      } as any;

      mockChildEducationStatusExtendedService.findByFields.mockResolvedValue(existingChildEducationStatus);
      mockChildEducationStatusExtendedService.save.mockResolvedValue(childEducationStatusDTO);
      mockNotesService.update.mockResolvedValue(childEducationStatusDTO.childEducationNotes[0].notes);

      const result = await controller.addUpdateChildEducationStatus(req, childEducationStatusDTO);

      expect(result).toEqual(childEducationStatusDTO);
      expect(mockChildEducationStatusExtendedService.findByFields).toHaveBeenCalledWith({
        where: { child: childEducationStatusDTO.child },
        relations: ['childEducationNotes'],
      });
      expect(mockChildEducationStatusExtendedService.save).toHaveBeenCalled();
      expect(mockNotesService.update).toHaveBeenCalled();
    });
  });
});
