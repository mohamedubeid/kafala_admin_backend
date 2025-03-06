import { Test, TestingModule } from '@nestjs/testing';
import { ChildExtendedService } from '../../service/child.extend.service';
import { UserService } from '../../service/user.service';
import { NotesService } from '../../service/notes.service';
import { ChildNotesExtendedService } from '../../service/child-notes.extend.service';
import { Request } from '../../client/request';
import { ChildExtendedDTO } from '../../service/dto/child.extend.dto';
import { ChildDTO } from '../../service/dto/child.dto';
import { HeaderUtil } from '../../client/header-util';
import { NotesDTO } from '../../service/dto/notes.dto';
import { UserDTO } from '../../service/dto/user.dto';
import { ChildHealthStatusDTO } from '../../service/dto/child-health-status.dto';
import { ChildMaritalStatusDTO } from '../../service/dto/child-marital-status.dto';
import { ChildEducationStatusDTO } from '../../service/dto/child-education-status.dto';
import { ChildSponsorShipDTO } from '../../service/dto/child-sponsor-ship.dto';
import { Gender } from '../../domain/enumeration/gender';
import { ChildExtendedController } from '../../web/rest/child.extend.controller';
import { ChildSponsorShipExtendedService } from '../../service/child-sponsor-ship.extend.service';

jest.mock('../../client/header-util');

describe('ChildExtendedController', () => {
  let controller: ChildExtendedController;
  let childExtendedService: ChildExtendedService;
  let userService: UserService;
  let notesService: NotesService;
  let childNotesExtendedService: ChildNotesExtendedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChildExtendedController],
      providers: [
        {
          provide: ChildExtendedService,
          useValue: {
            findByFields: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findById: jest.fn(),
            ensureUserDoesNotExist: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: NotesService,
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: ChildNotesExtendedService,
          useValue: {
            save: jest.fn(),
            findAllNotesByChild: jest.fn(),
            deleteById: jest.fn(),
          },
        },
        {
          provide: ChildSponsorShipExtendedService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ChildExtendedController>(ChildExtendedController);
    childExtendedService = module.get<ChildExtendedService>(ChildExtendedService);
    userService = module.get<UserService>(UserService);
    notesService = module.get<NotesService>(NotesService);
    childNotesExtendedService = module.get<ChildNotesExtendedService>(ChildNotesExtendedService);
  });

  describe('addUpdateChild', () => {
    it('should create a new child if it does not exist', async () => {
      const req = { res: {}, user: { login: 'testUser' } } as Request;
      const childDTO: ChildExtendedDTO = {
        id: 1,
        userId: 1,
        password: 'password',
        mobile: '1234567890',
        childNotes: [
          {
            notes: { id: 1, note: 'note1' } as NotesDTO,
            child: new ChildDTO(),
          },
        ],
        fatherName: '',
        fatherPhone: '',
        brotherCode: '',
        motherName: '',
        familyName: '',
        gender: Gender.MALE,
        age: 0,
        vedio: '',
        user: new UserDTO(),
        childHealthStatus: new ChildHealthStatusDTO(),
        childMaritalStatus: new ChildMaritalStatusDTO(),
        childEducationStatus: new ChildEducationStatusDTO(),
        childSponsorShip: new ChildSponsorShipDTO(),
        description: '',
        address: '',
      };

      const user = { id: 1, email: 'child@example.com' };
      const savedChild = { id: 1, user: user } as unknown as ChildDTO;
      const savedNote = { id: 1, note: 'note1' } as NotesDTO;

      userService.findById = jest.fn().mockResolvedValue(user);
      childExtendedService.findByFields = jest.fn().mockResolvedValue(undefined);
      childExtendedService.save = jest.fn().mockResolvedValue(savedChild);
      notesService.save = jest.fn().mockResolvedValue(savedNote);
      childNotesExtendedService.save = jest.fn().mockResolvedValue({});

      const result = await controller.addUpdateChild(req, childDTO);

      expect(userService.findById).toHaveBeenCalledWith(childDTO.userId);
      expect(childExtendedService.findByFields).toHaveBeenCalledWith({ where: { user: user }, relations: ['childNotes'] });
      expect(notesService.save).toHaveBeenCalledWith({ id: 1, note: 'note1' }, req.user.login);
      expect(childNotesExtendedService.save).toHaveBeenCalledWith({ notes: savedNote, child: savedChild }, req.user.login);
      expect(result).toEqual(savedChild);
    });

    it('should update an existing child', async () => {
      const req = { res: {}, user: { login: 'testUser' } } as Request;
      const childDTO: ChildExtendedDTO = {
        id: 1,
        userId: 1,
        password: 'password',
        mobile: '1234567890',
        childNotes: [
          {
            notes: { id: 1, note: 'note1' } as NotesDTO,
            child: new ChildDTO(),
          },
        ],
        fatherName: '',
        fatherPhone: '',
        brotherCode: '',
        motherName: '',
        familyName: '',
        gender: Gender.MALE,
        age: 0,
        vedio: '',
        user: new UserDTO(),
        childHealthStatus: new ChildHealthStatusDTO(),
        childMaritalStatus: new ChildMaritalStatusDTO(),
        childEducationStatus: new ChildEducationStatusDTO(),
        childSponsorShip: new ChildSponsorShipDTO(),
        description: undefined,
        address: '',
      };

      const user = { id: 1, email: 'child@example.com' };
      const existingChild = { id: 1, user: user, childNotes: [] } as unknown as ChildDTO;
      const savedChild = { id: 1, email: 'child@example.com' } as unknown as ChildDTO;
      const savedNote = { id: 1, note: 'note1' } as NotesDTO;

      userService.findById = jest.fn().mockResolvedValue(user);
      childExtendedService.findByFields = jest.fn().mockResolvedValue(existingChild);
      childExtendedService.save = jest.fn().mockResolvedValue(savedChild);
      notesService.save = jest.fn().mockResolvedValue(savedNote);
      childNotesExtendedService.save = jest.fn().mockResolvedValue({});

      const result = await controller.addUpdateChild(req, childDTO);

      expect(userService.findById).toHaveBeenCalledWith(childDTO.userId);
      expect(childExtendedService.findByFields).toHaveBeenCalledWith({ where: { user: user }, relations: ['childNotes'] });
      expect(childExtendedService.save).toHaveBeenCalledWith(
        { ...existingChild, ...childDTO, childNotes: existingChild.childNotes },
        req.user.login,
      );
      expect(notesService.save).toHaveBeenCalledWith({ id: 1, note: 'note1' }, req.user.login);
      expect(childNotesExtendedService.save).toHaveBeenCalledWith({ notes: savedNote, child: savedChild }, req.user.login);
      expect(result).toEqual(savedChild);
    });
  });
});
