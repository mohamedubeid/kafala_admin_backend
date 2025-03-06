import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { RelSponsershipTypesDTO } from '../src/service/dto/rel-sponsership-types.dto';
import { RelSponsershipTypesService } from '../src/service/rel-sponsership-types.service';

describe('RelSponsershipTypes Controller', () => {
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
      .overrideProvider(RelSponsershipTypesService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all rel-sponsership-types ', async () => {
    const getEntities: RelSponsershipTypesDTO[] = (await request(app.getHttpServer()).get('/api/rel-sponsership-types').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET rel-sponsership-types by id', async () => {
    const getEntity: RelSponsershipTypesDTO = (
      await request(app.getHttpServer())
        .get('/api/rel-sponsership-types/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create rel-sponsership-types', async () => {
    const createdEntity: RelSponsershipTypesDTO = (
      await request(app.getHttpServer()).post('/api/rel-sponsership-types').send(entityMock).expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update rel-sponsership-types', async () => {
    const updatedEntity: RelSponsershipTypesDTO = (
      await request(app.getHttpServer()).put('/api/rel-sponsership-types').send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update rel-sponsership-types from id', async () => {
    const updatedEntity: RelSponsershipTypesDTO = (
      await request(app.getHttpServer())
        .put('/api/rel-sponsership-types/' + entityMock.id)
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE rel-sponsership-types', async () => {
    const deletedEntity: RelSponsershipTypesDTO = (
      await request(app.getHttpServer())
        .delete('/api/rel-sponsership-types/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
