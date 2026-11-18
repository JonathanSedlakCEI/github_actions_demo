using DocumentApi.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddSingleton<IDocumentRepository, DocumentRepository>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendDevelopment", policy =>
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

app.UseCors("FrontendDevelopment");
app.MapControllers();

app.Run();
