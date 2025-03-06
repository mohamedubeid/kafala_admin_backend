import { Test, TestingModule } from '@nestjs/testing';
import { PageRequest } from '../../domain/base/pagination.entity';
import { ChildNotesExtendedService } from '../../service/child-notes.extend.service';
import { ChildSponsorShipExtendedService } from '../../service/child-sponsor-ship.extend.service';
import { ChildExtendedService } from '../../service/child.extend.service';
import { NotesService } from '../../service/notes.service';
import { UserService } from '../../service/user.service';
import { ChildExtendedController } from '../../web/rest/child.extend.controller';

describe('ChildExtendedController', () => {
  let controller: ChildExtendedController;
  let childSponsorShipService: ChildSponsorShipExtendedService;

  const mockChildSponsorShipService = {
    getChilds: jest.fn().mockImplementation((pageRequest: PageRequest, name: string) => {
      return Promise.resolve({
        data: [
          {
            id: 1,
            minimumCost: 200,
            child: {
              description: 'des',
              address: 'address',
              user: {
                id: 3,
                firstName: 'Nour',
                image: 'image.png',
              },
            },
            relSponsershipTypes: [
              { id: 1, sponsershipType: { type: 'EDUCATIONAL' } },
              { id: 2, sponsershipType: { type: 'HEALTH' } },
            ],
          },
        ],
        count: 1,
      });
    }),
  };

  const mockChildExtendedService = {};
  const mockUserService = {};
  const mockNotesService = {};
  const mockChildNotesExtendedService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChildExtendedController],
      providers: [
        {
          provide: ChildSponsorShipExtendedService,
          useValue: mockChildSponsorShipService,
        },
        {
          provide: ChildExtendedService,
          useValue: mockChildExtendedService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: NotesService,
          useValue: mockNotesService,
        },
        {
          provide: ChildNotesExtendedService,
          useValue: mockChildNotesExtendedService,
        },
      ],
    }).compile();

    controller = module.get<ChildExtendedController>(ChildExtendedController);
    childSponsorShipService = module.get<ChildSponsorShipExtendedService>(ChildSponsorShipExtendedService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return paginated results and count', async () => {
    const req = {
      query: {
        page: '0',
        size: '1',
        sort: 'id,asc',
        name: 'Nour',
      },
    } as any;

    const pageRequest = new PageRequest(0, 1, 'id,asc');
    const result = await controller.getChilds(req);

    expect(result).toEqual({
      data: [
        {
          id: 1,
          minimumCost: 200,
          child: {
            description: 'des',
            address: 'address',
            user: {
              id: 3,
              firstName: 'Nour',
              image: 'image.png',
            },
          },
          relSponsershipTypes: [
            { id: 1, sponsershipType: { type: 'EDUCATIONAL' } },
            { id: 2, sponsershipType: { type: 'HEALTH' } },
          ],
        },
      ],
      count: 1,
    });

    expect(childSponsorShipService.getChilds).toHaveBeenCalledWith(pageRequest, 'nour');
  });
});
