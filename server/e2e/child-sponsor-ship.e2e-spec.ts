import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { ChildSponsorShipDTO } from '../src/service/dto/child-sponsor-ship.dto';
import { ChildSponsorShipService } from '../src/service/child-sponsor-ship.service';

describe('ChildSponsorShip Controller', () => {
  let app: INestApplication;

  const authGuardMock = { canActivate: (): any => true };
  const rolesGuardMock = { canActivate: (): any => true };
  const entityMock: any = {
    id: 'entityId',
  };

  const serviceMock = {
    findById: (): any => entityMock,
    findAndCount: (): any => [entityMock, 0],
    save: (): any => entityMock,
    update: (): any => entityMock,
    deleteById: (): any => entityMock,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue(authGuardMock)
      .overrideGuard(RolesGuard)
      .useValue(rolesGuardMock)
      .overrideProvider(ChildSponsorShipService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all child-sponsor-ships ', async () => {
    const getEntities: ChildSponsorShipDTO[] = (await request(app.getHttpServer()).get('/api/child-sponsor-ships').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET child-sponsor-ships by id', async () => {
    const getEntity: ChildSponsorShipDTO = (
      await request(app.getHttpServer())
        .get('/api/child-sponsor-ships/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create child-sponsor-ships', async () => {
    const createdEntity: ChildSponsorShipDTO = (
      await request(app.getHttpServer()).post('/api/child-sponsor-ships').send(entityMock).expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update child-sponsor-ships', async () => {
    const updatedEntity: ChildSponsorShipDTO = (
      await request(app.getHttpServer()).put('/api/child-sponsor-ships').send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update child-sponsor-ships from id', async () => {
    const updatedEntity: ChildSponsorShipDTO = (
      await request(app.getHttpServer())
        .put('/api/child-sponsor-ships/' + entityMock.id)
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE child-sponsor-ships', async () => {
    const deletedEntity: ChildSponsorShipDTO = (
      await request(app.getHttpServer())
        .delete('/api/child-sponsor-ships/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
