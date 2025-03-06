import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { SettingDTO } from '../src/service/dto/setting.dto';
import { SettingService } from '../src/service/setting.service';

describe('Setting Controller', () => {
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
      .overrideProvider(SettingService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all settings ', async () => {
    const getEntities: SettingDTO[] = (await request(app.getHttpServer()).get('/api/settings').expect(200)).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET settings by id', async () => {
    const getEntity: SettingDTO = (
      await request(app.getHttpServer())
        .get('/api/settings/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create settings', async () => {
    const createdEntity: SettingDTO = (await request(app.getHttpServer()).post('/api/settings').send(entityMock).expect(201)).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update settings', async () => {
    const updatedEntity: SettingDTO = (await request(app.getHttpServer()).put('/api/settings').send(entityMock).expect(201)).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/PUT update settings from id', async () => {
    const updatedEntity: SettingDTO = (
      await request(app.getHttpServer())
        .put('/api/settings/' + entityMock.id)
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE settings', async () => {
    const deletedEntity: SettingDTO = (
      await request(app.getHttpServer())
        .delete('/api/settings/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
