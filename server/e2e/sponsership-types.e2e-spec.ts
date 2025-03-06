import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { SponsershipTypesDTO } from '../src/service/dto/sponsership-types.dto';
import { SponsershipTypesService } from '../src/service/sponsership-types.service';

describe('SponsershipTypes Controller', () => {
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
      .overrideProvider(SponsershipTypesService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all sponsership-types ', async () => {
    const getEntities: SponsershipTypesDTO[] = (await request(app.getHttpServer()).get('/api/sponsership-types').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET sponsership-types by id', async () => {
    const getEntity: SponsershipTypesDTO = (
      await request(app.getHttpServer())
        .get('/api/sponsership-types/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create sponsership-types', async () => {
    const createdEntity: SponsershipTypesDTO = (
      await request(app.getHttpServer()).post('/api/sponsership-types').send(entityMock).expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update sponsership-types', async () => {
    const updatedEntity: SponsershipTypesDTO = (
      await request(app.getHttpServer()).put('/api/sponsership-types').send(entityMock).expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update sponsership-types from id', async () => {
    const updatedEntity: SponsershipTypesDTO = (
      await request(app.getHttpServer())
        .put('/api/sponsership-types/' + entityMock.id)
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE sponsership-types', async () => {
    const deletedEntity: SponsershipTypesDTO = (
      await request(app.getHttpServer())
        .delete('/api/sponsership-types/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
