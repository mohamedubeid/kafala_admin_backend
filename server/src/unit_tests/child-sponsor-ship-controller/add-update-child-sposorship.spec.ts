import { Test, TestingModule } from '@nestjs/testing';
import { ChildSponsorShipExtendedService } from '../../service/child-sponsor-ship.extend.service';
import { ChildSponsorShipNotesService } from '../../service/child-sponsor-ship-notes.service';
import { NotesService } from '../../service/notes.service';
import { SponsershipTypesService } from '../../service/sponsership-types.service';
import { RelSponsershipTypesService } from '../../service/rel-sponsership-types.service';
import { ChildSponsorShipDTO } from '../../service/dto/child-sponsor-ship.dto';
import { Request } from '../../client/request';
import { ChildSponsorShipExtendedController } from '../../web/rest/child-sponsor-ship.extend.controller';

describe('ChildSponsorShipExtendedController', () => {
  let controller: ChildSponsorShipExtendedController;
  let childSponsorShipService: ChildSponsorShipExtendedService;
  let notesService: NotesService;
  let childSponsorShipNotesService: ChildSponsorShipNotesService;
  let sponsershipTypesService: SponsershipTypesService;
  let relSponsershipTypesService: RelSponsershipTypesService;

  const mockChildSponsorShipService = {
    findByFields: jest.fn(),
    save: jest.fn(),
  };

  const mockNotesService = {
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockChildSponsorShipNotesService = {
    save: jest.fn(),
  };

  const mockSponsershipTypesService = {
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockRelSponsershipTypesService = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChildSponsorShipExtendedController],
      providers: [
        { provide: ChildSponsorShipExtendedService, useValue: mockChildSponsorShipService },
        { provide: NotesService, useValue: mockNotesService },
        { provide: ChildSponsorShipNotesService, useValue: mockChildSponsorShipNotesService },
        { provide: SponsershipTypesService, useValue: mockSponsershipTypesService },
        { provide: RelSponsershipTypesService, useValue: mockRelSponsershipTypesService },
      ],
    }).compile();

    controller = module.get<ChildSponsorShipExtendedController>(ChildSponsorShipExtendedController);
    childSponsorShipService = module.get<ChildSponsorShipExtendedService>(ChildSponsorShipExtendedService);
    notesService = module.get<NotesService>(NotesService);
    childSponsorShipNotesService = module.get<ChildSponsorShipNotesService>(ChildSponsorShipNotesService);
    sponsershipTypesService = module.get<SponsershipTypesService>(SponsershipTypesService);
    relSponsershipTypesService = module.get<RelSponsershipTypesService>(RelSponsershipTypesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addUpdateChildMirtalStatus', () => {
    it('should create a new child sponsorship if it does not exist', async () => {
      const req = { user: { login: 'testUser' } } as Request;
      const childSponsorShipDTO: ChildSponsorShipDTO = {
        child: { id: 1 },
        childSponsorShipNotes: [{ notes: { id: null, note: 'Test note' } }],
        relSponsershipTypes: [{ sponsershipType: { id: null, type: 'EDUCATIONAL' } }],
      } as any;

      const storedChildSponsorship = { ...childSponsorShipDTO };

      mockChildSponsorShipService.findByFields.mockResolvedValue(null);
      mockChildSponsorShipService.save.mockResolvedValue(storedChildSponsorship);
      mockNotesService.save.mockResolvedValue(childSponsorShipDTO.childSponsorShipNotes[0].notes);
      mockChildSponsorShipNotesService.save.mockResolvedValue({});
      mockSponsershipTypesService.save.mockResolvedValue(childSponsorShipDTO.relSponsershipTypes[0].sponsershipType);
      mockRelSponsershipTypesService.save.mockResolvedValue({});

      const result = await controller.addUpdateChildSponsor(req, childSponsorShipDTO);

      expect(result).toEqual(storedChildSponsorship);
      expect(mockChildSponsorShipService.findByFields).toHaveBeenCalledWith({
        where: { child: childSponsorShipDTO.child },
        relations: ['childSponsorShipNotes', 'relSponsershipTypes'],
      });
      expect(mockChildSponsorShipService.save).toHaveBeenCalled();
      expect(mockNotesService.save).toHaveBeenCalled();
      expect(mockChildSponsorShipNotesService.save).toHaveBeenCalled();
      expect(mockSponsershipTypesService.save).toHaveBeenCalled();
      expect(mockRelSponsershipTypesService.save).toHaveBeenCalled();
    });

    it('should update existing child sponsorship if it exists', async () => {
      const req = { user: { login: 'testUser' } } as Request;
      const existingChildSponsorship = {
        id: 1,
        child: { id: 1 },
        childSponsorShipNotes: [{ notes: { id: 1, note: 'Existing note' } }],
        relSponsershipTypes: [{ sponsershipType: { id: 1, type: 'EDUCATIONAL' } }],
      };
      const childSponsorShipDTO: ChildSponsorShipDTO = {
        child: { id: 1 },
        childSponsorShipNotes: [{ notes: { id: 1, note: 'Updated note' } }],
        relSponsershipTypes: [{ sponsershipType: { id: 1, type: 'EDUCATIONAL' } }],
      } as any;

      const storedChildSponsorship = { ...existingChildSponsorship, ...childSponsorShipDTO };

      mockChildSponsorShipService.findByFields.mockResolvedValue(existingChildSponsorship);
      mockChildSponsorShipService.save.mockResolvedValue(storedChildSponsorship);
      mockNotesService.update.mockResolvedValue(childSponsorShipDTO.childSponsorShipNotes[0].notes);
      mockChildSponsorShipNotesService.save.mockResolvedValue({});
      mockSponsershipTypesService.update.mockResolvedValue(childSponsorShipDTO.relSponsershipTypes[0].sponsershipType);
      mockRelSponsershipTypesService.save.mockResolvedValue({});

      const result = await controller.addUpdateChildSponsor(req, childSponsorShipDTO);

      expect(result).toEqual(storedChildSponsorship);
      expect(mockChildSponsorShipService.findByFields).toHaveBeenCalledWith({
        where: { child: childSponsorShipDTO.child },
        relations: ['childSponsorShipNotes', 'relSponsershipTypes'],
      });
      expect(mockChildSponsorShipService.save).toHaveBeenCalled();
      expect(mockNotesService.update).toHaveBeenCalled();
      expect(mockChildSponsorShipNotesService.save).toHaveBeenCalled();
      expect(mockSponsershipTypesService.update).toHaveBeenCalled();
      expect(mockRelSponsershipTypesService.save).toHaveBeenCalled();
    });
  });
});
